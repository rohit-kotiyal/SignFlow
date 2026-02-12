from fastapi import FastAPI

app = FastAPI(title="Signflow API")

@app.get("/")
def root():
    return {"message": "Signflow API running"}