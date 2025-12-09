"use client";

import { useState } from "react";



const STAGE_LABELS = {
  1: "Documentation",
  2: "Stage 2",
  3: "Stage 3",
  4: "Stage 4",
  5: "Stage 5",
  6: "Stage 6",
  7: "Stage 7",
  8: "Stage 8",
  9: "Stage 9",
  10: "Stage 10",
};

const DEFAULT_IMPORT_DOCS = [
  "KYC Documents",
  "Import Invoice",
  "Packing List",
  "Bill of Lading Copy",
];

const DEFAULT_EXPORT_DOCS = [
  "KYC Documents",
  "Export Invoice",
  "Packing List",
  "Shipping Bill Copy",
];

function getDefaultDocs(job) {
  const isImport = job.jobId?.includes("-IM-");
  const names = isImport ? DEFAULT_IMPORT_DOCS : DEFAULT_EXPORT_DOCS;

  return names.map((name) => ({
    name,
    isCompleted: false,
    fileUrl: null,
    completedAt: null,
  }));
}

function mergeDocuments(existingDocs = [], defaultDocs = []) {
  return defaultDocs.map((doc) => {
    const match = existingDocs.find((d) => d.name === doc.name);
    if (!match) return doc;

    return {
      ...doc,
      ...match,
      isCompleted: Boolean(match.isCompleted ?? match.confirmed),
    };
  });
}

export default function JobDocumentsPanel({ job }) {
  const [currentJob, setCurrentJob] = useState(() => {
    const defaults = getDefaultDocs(job);
    const mergedDocs = mergeDocuments(job.documents || [], defaults);

    return { ...job, documents: mergedDocs };
  });

  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [confirmingDoc, setConfirmingDoc] = useState(null);
  const [stageLoading, setStageLoading] = useState(false);

  const nextStage = STAGE_LABELS[currentJob.stage] || `Stage ${currentJob.stage}`;

  const allDocsDone =
    currentJob.documents.length > 0 &&
    currentJob.documents.every((d) => d.isCompleted === true);

    async function uploadDocument(docName, file) {
      if (!file) return alert("Please select a file");
    
      setUploadingDoc(docName);
    
      try {
        // 1️⃣ Get signed upload URL
        const uploadUrlRes = await fetch("/api/uploadthing/url", {
          method: "POST",
        });
        const { url } = await uploadUrlRes.json();
    
        // 2️⃣ Upload file directly to UploadThing storage
        const uploadRes = await fetch(url, {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": file.type,
            "x-uploadthing-filename": file.name,
          },
        });
    
        const uploaded = await uploadRes.json();
    
        if (!uploaded || !uploaded.files || !uploaded.files[0]?.url) {
          console.error("UploadThing response:", uploaded);
          alert("Upload failed");
          return;
        }
    
        const fileUrl = uploaded.files[0].url;
    
        // 3️⃣ Save URL to database
        const res = await fetch("/api/admin/jobs/upload-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: currentJob._id,
            documentName: docName,
            fileUrl,
          }),
        });
    
        const data = await res.json();
        if (!res.ok) return alert(data.error);
    
        // 4️⃣ Update UI
        setCurrentJob((prev) => ({
          ...prev,
          documents: mergeDocuments(data.job.documents, getDefaultDocs(prev)),
        }));
    
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed");
      } finally {
        setUploadingDoc(null);
      }
    }
    

  async function confirmDocument(docName) {
    if (!window.confirm(`Confirm "${docName}" and notify client?`)) return;

    try {
      setConfirmingDoc(docName);

      const res = await fetch("/api/admin/jobs/confirm-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: currentJob._id,
          documentName: docName,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      setCurrentJob((prev) => ({
        ...prev,
        documents: mergeDocuments(data.job.documents, getDefaultDocs(prev)),
      }));

      alert("Document confirmed. Email sent to client.");
    } catch (err) {
      alert("Error confirming document");
    } finally {
      setConfirmingDoc(null);
    } 
  }

  async function nextStageHandler() {
    if (!window.confirm("Move job to next stage and notify client?")) return;

    try {
      setStageLoading(true);

      const res = await fetch("/api/admin/jobs/next-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: currentJob._id }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      setCurrentJob((prev) => ({
        ...prev,
        stage: data.job.stage,
        status: data.job.status,
      }));

      alert("Stage updated & email sent.");
    } catch (err) {
      alert("Error updating stage");
    } finally {
      setStageLoading(false);
    }
  }

  return (
    <section className="mt-10 bg-white rounded-2xl shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Documentation & Stages</h2>
          <p className="text-sm text-gray-600">
            Current Stage: <span className="font-medium">{nextStage}</span> ({currentJob.status})
          </p>
        </div>

        {allDocsDone && currentJob.stage < 10 && (
          <button
            onClick={nextStageHandler}
            disabled={stageLoading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            {stageLoading ? "Updating..." : "Move To Next Stage"}
          </button>
        )}
      </div>

      {/* DOCUMENTS */}
      <div className="space-y-4">
        {currentJob.documents.map((doc) => {
          const isCompleted = Boolean(doc.isCompleted);

          return (
            <div
              key={doc.name}
              className="flex justify-between items-center border p-4 rounded-xl"
            >
              <div>
                <p className="font-semibold">{doc.name}</p>

                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    className="text-blue-600 underline text-sm"
                  >
                    View File
                  </a>
                )}

                {doc.completedAt && (
                  <p className="text-xs text-gray-500">
                    Confirmed: {new Date(doc.completedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Upload */}
                <input
                  type="file"
                  onChange={(e) => uploadDocument(doc.name, e.target.files[0])}
                  className="text-sm"
                />

                {/* Confirm */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled={isCompleted}
                    checked={isCompleted}
                    onChange={() => confirmDocument(doc.name)}
                  />
                  <span className="text-sm">
                    {isCompleted ? "Confirmed" : "Mark as Confirmed"}
                  </span>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
