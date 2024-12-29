import React from "react";
import FileUploader from "../components/FileUploader";

const UploadPage = () => {
    const handleUploadComplete = (url) => {
        console.log("File caricato! URL:", url);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#178563] to-white text-white">
            <h1 className="text-3xl font-bold mb-6">Pagina di Caricamento</h1>
            <div className="bg-white text-[#178563] p-6 rounded shadow-md">
                <FileUploader onUploadComplete={handleUploadComplete} />
            </div>
        </div>
    );
};

export default UploadPage;
