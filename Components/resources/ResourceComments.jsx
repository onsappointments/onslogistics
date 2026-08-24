"use client";

import { useEffect, useState } from "react";

export default function ResourceComments({
  articleSlug,
  articleTitle,
}) {
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [question, setQuestion] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
  let cancelled = false;

  async function loadComments() {
    try {
      setIsLoadingComments(true);

      const response = await fetch(
        `/api/resources/comments?articleSlug=${encodeURIComponent(
          articleSlug
        )}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load questions."
        );
      }

      if (!cancelled) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error(
        "RESOURCE COMMENTS LOAD ERROR:",
        error
      );

      if (!cancelled) {
        setComments([]);
      }
    } finally {
      if (!cancelled) {
        setIsLoadingComments(false);
      }
    }
  }

  loadComments();

  return () => {
    cancelled = true;
  };
}, [articleSlug]);

  const handleSubmit = async () => {
  setError("");

  // -----------------------------
  // Basic frontend validation
  // -----------------------------

  if (!name.trim()) {
    setError("Please enter your name.");
    return;
  }

  if (!email.trim() && !mobile.trim()) {
    setError("Please provide either your email or mobile number.");
    return;
  }

  if (!question.trim()) {
    setError("Please enter your question.");
    return;
  }

  try {
    setIsSubmitting(true);

    const response = await fetch("/api/resources/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleSlug,
        articleTitle,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        question: question.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to submit your question."
      );
    }

    // -----------------------------
    // Success
    // -----------------------------

   const newComment = {
  _id: data.commentId,
  name: name.trim(),
  question: question.trim(),
  isAnswered: false,
  answer: null,
  answeredAt: null,
  createdAt: new Date().toISOString(),
};

setComments((currentComments) => [
  newComment,
  ...currentComments,
]);

setSuccess(true);

setName("");
setEmail("");
setMobile("");
setQuestion("");
  } catch (error) {
    console.error("RESOURCE COMMENT SUBMIT ERROR:", error);

    setError(
      error.message ||
        "Something went wrong while submitting your question."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      {/* ================================
          QUESTIONS & DISCUSSION
      ================================= */}

      <section className="mt-16">
        <div className="border-t border-gray-200 pt-10">

          {/* Header */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.1 9.1 0 0 1-4-.9L3 21l1.9-4.4A8.1 8.1 0 0 1 3 11.5C3 7 7 3 12 3s9 3.5 9 8.5Z" />
                  <path d="M8 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M16 10h.01" />
                </svg>
              </div>

              <span className="text-sm font-medium text-blue-600">
                Community Questions
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Questions & Discussion
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Have a question about this article? Ask the ONS Logistics team
              and get a practical answer.
            </p>
          </div>

          {/* Ask Question Card */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-7">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Have a question?
                </h3>

                <p className="mt-1 text-sm text-gray-500 max-w-xl">
                  Ask something specific about this topic. Your question can
                  help other importers, exporters, and businesses too.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] whitespace-nowrap"
              >
                Ask a Question

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>

            </div>
          </div>

          {/* Questions Display*/}
          {isLoadingComments ? (
  <div className="mt-8 rounded-2xl border border-gray-200 px-6 py-8 text-center">
    <p className="text-sm text-gray-500">
      Loading questions...
    </p>
  </div>
) : comments.length > 0 ? (
  <div className="mt-8 space-y-4">
    {comments.map((comment) => (
      <article
        key={comment._id}
        className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6"
      >
        {/* Question author */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
            {comment.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {comment.name}
            </p>

            <p className="text-xs text-gray-400">
              Community question
            </p>
          </div>
        </div>

        {/* Question */}
        <p className="mt-4 text-sm leading-relaxed text-gray-700">
          {comment.question}
        </p>

        {/* ONS Answer */}
        {comment.isAnswered && comment.answer && (
          <div className="mt-5 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              ONS Logistics India
            </p>

            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {comment.answer}
            </p>
          </div>
        )}
      </article>
    ))}
  </div>
) : (
  <div className="mt-8 rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center">
    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-400">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    </div>

    <p className="mt-4 text-sm font-medium text-gray-700">
      No questions yet
    </p>

    <p className="mt-1 text-sm text-gray-500">
      Be the first to ask something about this topic.
    </p>
  </div>
)}

        </div>
      </section>

      {/* ================================
          QUESTION MODAL
      ================================= */}

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Ask ONS Logistics
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Ask a question about this article.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>

              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">

              {/* Article context */}
              <div className="mb-4 rounded-xl bg-blue-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  You're asking about
                </p>

                <p className="mt-1 text-sm font-medium leading-relaxed text-gray-800">
                  {articleTitle}
                </p>
              </div>
               
              {success ? (
              <div className="py-6 text-center">
               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 12 4 4L19 6" />
      </svg>
    </div>

    <h3 className="mt-4 text-lg font-semibold text-gray-900">
      Question submitted
    </h3>

    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
      Thank you for your question. The ONS Logistics team will review it
      and respond as soon as possible.
    </p>

    <button
      type="button"
      onClick={() => {
        setSuccess(false);
        setShowModal(false);
      }}
      className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
    >
      Done
    </button>
  </div>
) : (
  <>
    {/* existing Name / Email / Mobile / Question / Privacy / Submit */}


              {/* Name */}
              <div>
                <label
                  htmlFor="comment-name"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Name
                </label>

                <input
                  id="comment-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Email / Mobile */}
              <div className="mt-3">
                <label
                  htmlFor="comment-email"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Email 
                </label>

                <input
                  id="comment-email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <p className="mt-2 text-xs text-gray-400">
                  One of these is required so we can respond to you.
                </p>
              </div>
              <div className="mt-5">
                <label
                  htmlFor="comment-mobile"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Mobile number
                </label>

                <input
                  id="comment-mobile"
                  type="tel"
                  placeholder=" Mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <p className="mt-2 text-xs text-gray-400">
                  One of these is required so we can respond to you.
                </p>
              </div>

              {/* Question */}
              <div className="mt-5">
                <label
                  htmlFor="comment-question"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Your question
                </label>

                <textarea
                  id="comment-question"
                  rows={3}
                  placeholder="What would you like to know?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Privacy */}
              <div className="mt-3 flex items-start gap-2">
                <svg
                  className="mt-0.5 shrink-0 text-gray-400"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

                <p className="text-xs leading-relaxed text-gray-400">
                  Your contact details are private and will not be displayed
                  publicly with your question.
                </p>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
               type="button"
               onClick={handleSubmit}
               disabled={isSubmitting}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Question"}

                {!isSubmitting && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                   >
                  <path d="M22 2 11 13" />
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  </svg>
               )}
               </button>
                </>
)}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}