"use client";

import React, { useEffect, useState } from "react";
import { 
  Upload, 
  Trash2, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  File
} from "lucide-react";

type FileMeta = {
  id: number;
  original_name: string;
  size: number;
  created_at: string;
};

export default function Page() {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function loadFiles() {
    const res = await fetch("/api/files");
    setFiles(await res.json());
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function uploadFile(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    
    if (!file) {
        setIsSuccess(false);
        return setMsg("Please select a PDF file first.");
    }
    if (file.type !== "application/pdf") {
        setIsSuccess(false);
        return setMsg("Only PDF files are allowed.");
    }

    setIsLoading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });

      if (res.ok) {
        setMsg("Document uploaded successfully.");
        setIsSuccess(true);
        setFile(null);
        // Reset file input value
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if(fileInput) fileInput.value = "";
        
        loadFiles();
      } else {
        const err = await res.json();
        setIsSuccess(false);
        setMsg(err.error || "Upload failed. Please try again.");
      }
    } catch (error) {
        setIsSuccess(false);
        setMsg("An error occurred while uploading.");
    } finally {
        setIsLoading(false);
    }
  }

  async function deleteFile(id: number) {
    if (!confirm("Are you sure you want to delete this document?")) return;

    const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
    if (res.ok) loadFiles();
  }

  // Helper to format bytes to KB/MB
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Medical Documents</h1>
                <p className="text-slate-500 text-sm mt-1">Patient Portal • Secure File Access</p>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="p-8 bg-slate-50/50">
            <form onSubmit={uploadFile} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 w-full">
                <label 
                  htmlFor="fileInput" 
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Upload New Record
                </label>
                <div className="relative">
                  <input
                    id="fileInput"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      cursor-pointer border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {isLoading ? (
                    "Uploading..."
                ) : (
                    <>
                        <Upload className="w-4 h-4" /> Upload PDF
                    </>
                )}
              </button>
            </form>

            {/* Notifications */}
            {msg && (
              <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 text-sm ${isSuccess ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {msg}
              </div>
            )}
          </div>
        </div>

        {/* Files List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Uploaded Files</h2>
          </div>

          {files.length === 0 ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center">
              <div className="bg-slate-50 p-4 rounded-full mb-3">
                <File className="w-8 h-8 text-slate-300" />
              </div>
              <p>No documents found.</p>
              <p className="text-sm mt-1">Upload a PDF to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Document Name</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Date Uploaded</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {files.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded text-red-600">
                            <FileText className="w-4 h-4" />
                        </div>
                        {f.original_name}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {formatSize(f.size)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(f.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                        <span className="text-slate-400 text-xs ml-2">
                             {new Date(f.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/api/files/${f.id}`}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => deleteFile(f.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}