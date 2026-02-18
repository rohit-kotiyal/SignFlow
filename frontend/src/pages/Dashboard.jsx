import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import api from "../api/api";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

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

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
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
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedFile(null);
    setPageNumber(1);
    setNumPages(null);
  };

  return (
    <div className="min-h-screen m-4">
      <h1 className="text-3xl font-bold px-8 py-4 text-indigo-600">Dashboard</h1>

      {/* Upload Section */}
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg m-4 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Upload File</h2>
        <input
          className="block w-full sm:w-auto text-sm text-gray-600 
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-medium
          file:bg-indigo-50 file:text-indigo-600
          hover:file:bg-indigo-100
          hover:cursor-pointer transition"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={handleUpload}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl shadow-md
          hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-200 hover:cursor-pointer"
        >
          Upload
        </button>
      </div>

      {/* Document List */}
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg m-4 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Document List</h2>
        {documents.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No documents uploaded yet</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <span
                  onClick={() => setSelectedFile(`${api.defaults.baseURL}/${doc.filepath}`)}
                  className="cursor-pointer text-indigo-600 hover:underline font-medium"
                >
                  {doc.filename}
                </span>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="bg-red-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg
                  hover:bg-red-600 active:scale-95 transition-all duration-200 hover:cursor-pointer"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* PDF Modal */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
          onClick={closeModal} // click outside to close
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-fit max-h-[90vh] flex flex-col items-center overflow-auto relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold transition"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4">PDF Preview</h2>

            <Document
              file={selectedFile}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setPageNumber(1);
              }}
            >
              <Page pageNumber={pageNumber} />
            </Document>

            {/* Pagination */}
            <div className="flex gap-4 mt-6 items-center">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {pageNumber} of {numPages}
              </span>
              <button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}