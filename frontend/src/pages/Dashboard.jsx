import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import api from "../api/api";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [signatureMode, setSignatureMode] = useState(false);
  const [signaturePositions, setSignaturePositions] = useState({});
  const [signatureImage, setSignatureImage] = useState(null);

  const [showSignModal, setShowSignModal] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents/my-documents");
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // FETCH SAVED SIGNATURES WHEN DOCUMENT SELECTED
  useEffect(() => {
    if (!selectedDocumentId) return;

    const fetchSignatures = async () => {
      try {
        const res = await api.get(`/signatures/${selectedDocumentId}`);

        const grouped = {};
        res.data.forEach((sig) => {
          if (!grouped[sig.page]) {
            grouped[sig.page] = [];
          }

          grouped[sig.page].push({
            x: sig.x,
            y: sig.y,
          });
        });

        setSignaturePositions(grouped);
      } catch (err) {
        console.error("Error fetching signatures:", err);
      }
    };

    fetchSignatures();
  }, [selectedDocumentId]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setFileInputKey((prev) => prev + 1);
      fetchDocuments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
      setSelectedFile(null);
      setSelectedDocumentId(null); 
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedFile(null);
    setSelectedDocumentId(null); 
    setPageNumber(1);
    setNumPages(null);
    setSignatureMode(false);
    setSignaturePositions({});
  };

  const currentPageSignatures = signaturePositions[pageNumber] || [];

  return (
    <div className="min-h-screen m-4">
      <h1 className="text-3xl font-bold px-8 py-4 text-indigo-600">
        Dashboard
      </h1>

      {/* Upload Section */}
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg m-4 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <h2 className="text-xl font-bold text-gray-800">Upload File</h2>
        <input
          key={fileInputKey}
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full sm:w-auto text-sm text-gray-600 cursor-pointer" 
        />
        <button
          onClick={handleUpload}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl cursor-pointer"
        >
          Upload
        </button>
      </div>

      {/* Document List */}
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg m-4 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Document List
        </h2>

        <ul className="space-y-4">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border"
            >
              <span
                onClick={() => {
                  setSelectedFile(
                    `${api.defaults.baseURL}/${doc.filepath}`
                  );
                  setSelectedDocumentId(doc.id);
                }}
                className="cursor-pointer text-indigo-600 hover:underline"
              >
                {doc.filename}
              </span>

              <button
                onClick={() => handleDelete(doc.id)}
                className="bg-red-500 text-white px-4 py-1.5 rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* PDF Modal */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">PDF Preview</h2>

            <button
              onClick={() => {
                if (!signatureImage) {
                  setShowSignModal(true);
                } else {
                  setSignatureMode(!signatureMode);
                }
              }}
              className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer"
            >
              {signatureMode ? "Cancel Sign" : "Add Signature"}
            </button>

            <Document
              file={selectedFile}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setPageNumber(1);
              }}
            >
              <div
                className="relative"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!signatureMode || !signatureImage) return;

                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  // UI Update
                  setSignaturePositions((prev) => ({
                    ...prev,
                    [pageNumber]: [
                      ...(prev[pageNumber] || []),
                      { x, y },
                    ],
                  }));

                  // SAVE TO BACKEND
                  try {
                    await api.post("/signatures/", {
                      document_id: selectedDocumentId,
                      x,
                      y,
                      page: pageNumber,
                    });
                  } catch (err) {
                    console.error("Error saving signature:", err);
                  }

                  setSignatureMode(false);
                }}
              >
                <Page pageNumber={pageNumber} />

                {signatureImage &&
                  currentPageSignatures.map((pos, index) => (
                    <p
                      key={index}
                      className="absolute text-3xl"
                      style={{
                        top: pos.y,
                        left: pos.x,
                        fontFamily: "cursive",
                      }}
                    >
                      {signatureImage}
                    </p>
                  ))}
              </div>
            </Document>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowSignModal(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              Type Your Signature
            </h2>

            <input
              type="text"
              placeholder="Enter your name"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <div className="border rounded-lg p-4 mb-4 text-center">
              <p
                className="text-3xl"
                style={{ fontFamily: "cursive" }}
              >
                {typedSignature || "Signature Preview"}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!typedSignature.trim()) return;

                  setSignatureImage(typedSignature);
                  setShowSignModal(false);
                  setSignatureMode(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
