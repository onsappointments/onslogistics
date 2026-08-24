"use client";

import { useEffect, useState } from "react";

export default function ResourceQuestionsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedComment, setSelectedComment] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/resource-comments",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load resource questions."
          );
        }

        setComments(data.comments || []);
      } catch (error) {
        console.error(
          "RESOURCE QUESTIONS LOAD ERROR:",
          error
        );

        setError(
          error.message ||
            "Something went wrong while loading questions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  const openAnswerModal = (comment) => {
  setSelectedComment(comment);
  setAnswer(comment.answer || "");
  setAnswerError("");
  setIsAnswerModalOpen(true);
};

const closeAnswerModal = () => {
  if (isSubmittingAnswer) return;

  setIsAnswerModalOpen(false);
  setSelectedComment(null);
  setAnswer("");
  setAnswerError("");
};
const submitAnswer = async () => {
  if (!selectedComment) return;

  const cleanAnswer = answer.trim();

  if (cleanAnswer.length < 5) {
    setAnswerError("Please enter an answer.");
    return;
  }

  try {
    setIsSubmittingAnswer(true);
    setAnswerError("");

    const response = await fetch(
      `/api/resources/comments/${selectedComment._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: cleanAnswer,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to publish answer."
      );
    }

    // ==========================================
    // UPDATE LOCAL QUESTION
    // ==========================================

    setComments((currentComments) =>
      currentComments.map((comment) =>
        comment._id === selectedComment._id
          ? {
              ...comment,
              answer: cleanAnswer,
              isAnswered: true,
              answeredAt:
                data.comment?.answeredAt ||
                new Date().toISOString(),
            }
          : comment
      )
    );

    // ==========================================
    // CLOSE MODAL
    // ==========================================

    setIsAnswerModalOpen(false);
    setSelectedComment(null);
    setAnswer("");
    setAnswerError("");
  } catch (error) {
    console.error(
      "RESOURCE ANSWER SUBMIT ERROR:",
      error
    );

    setAnswerError(
      error.message || "Unable to publish answer."
    );
  } finally {
    setIsSubmittingAnswer(false);
  }
};

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Resource Questions
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Review questions submitted by visitors through the
          ONS Logistics Resources Hub.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Loading questions...
          </p>
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <svg
              width="22"
              height="22"
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

          <h2 className="mt-4 text-base font-semibold text-gray-800">
            No resource questions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            New questions submitted through the Resources Hub
            will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              {/* Article */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    Resource Article
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    {comment.articleTitle ||
                      comment.articleSlug ||
                      "Unknown article"}
                  </h2>
                </div>

                {/* Status */}
                {comment.isAnswered ? (
                  <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Answered
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                    Awaiting Answer
                  </span>
                )}
              </div>

              {/* Question */}
              <div className="mt-5 rounded-xl bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Question
                </p>

                <p className="mt-2 text-base leading-relaxed text-gray-800">
                  {comment.question}
                </p>
              </div>

              {/* Contact */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {comment.name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {comment.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Mobile
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {comment.mobile || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {comment.createdAt
                      ? new Date(
                          comment.createdAt
                        ).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Existing answer */}
              {comment.isAnswered && comment.answer && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    ONS Logistics India — Answer
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-gray-800">
                    {comment.answer}
                  </p>
                </div>
              )}

              {/* Answer button — placeholder for next step */}
              {!comment.isAnswered && (
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => openAnswerModal(comment)}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
                  >
                    Answer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isAnswerModalOpen && selectedComment && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        closeAnswerModal();
      }
    }}
  >
    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Answer Question
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your answer will be published publicly as an
            official ONS Logistics India response.
          </p>
        </div>

        <button
          type="button"
          onClick={closeAnswerModal}
          disabled={isSubmittingAnswer}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
        >
          <svg
            width="20"
            height="20"
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

      {/* Body */}
      <div className="space-y-5 px-6 py-6">
        {/* Article */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Resource Article
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {selectedComment.articleTitle ||
              selectedComment.articleSlug}
          </p>
        </div>

        {/* Question */}
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Question
          </p>

          <p className="mt-2 text-sm leading-relaxed text-gray-800">
            {selectedComment.question}
          </p>

          <p className="mt-3 text-xs text-gray-400">
            Asked by {selectedComment.name}
          </p>
        </div>

        {/* Answer */}
        <div>
          <label
            htmlFor="resource-answer"
            className="block text-sm font-semibold text-gray-900"
          >
            Your Answer
          </label>

          <textarea
            id="resource-answer"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setAnswerError("");
            }}
            rows={7}
            maxLength={5000}
            placeholder="Write a clear and helpful answer..."
            disabled={isSubmittingAnswer}
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
          />

          <div className="mt-1 flex justify-between">
            <p className="text-xs text-gray-400">
              This answer will be visible publicly.
            </p>

            <p className="text-xs text-gray-400">
              {answer.length}/5000
            </p>
          </div>
        </div>

        {/* Error */}
        {answerError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {answerError}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
        <button
          type="button"
          onClick={closeAnswerModal}
          disabled={isSubmittingAnswer}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={submitAnswer}
          disabled={
            isSubmittingAnswer ||
            answer.trim().length < 5
          }
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmittingAnswer
            ? "Publishing..."
            : "Publish Answer"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}