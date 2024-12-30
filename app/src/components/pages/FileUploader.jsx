import React from "react";
import { uploadFile } from "@/components/ui/uploadFile";

const FileUploader = ({ onUploadComplete }) => {
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const url = await uploadFile(file);
        if (onUploadComplete) {
            onUploadComplete(url); // Notifica il completamento
        }
    };

    return (
        <div className="file-uploader">
            <h2 className="text-xl font-bold mb-4">Carica un file</h2>
            <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 rounded p-2"
            />
        </div>
    );
};

export default FileUploader;
