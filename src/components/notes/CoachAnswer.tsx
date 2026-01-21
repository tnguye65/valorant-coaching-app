"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";

interface CoachAnswerProps {
  noteId: string;
  answer: string | null;
  answerQuestion: (formData: FormData) => Promise<void>;
}

export function CoachAnswer({
  noteId,
  answer,
  answerQuestion,
}: CoachAnswerProps) {
  const [isEditing, setIsEditing] = useState(!answer); // Auto-edit if no answer yet

  if (!isEditing && answer) {
    // Display mode - show answer with edit button
    return (
      <>
        <h1>A: </h1>
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-700 flex-1">{answer}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 p-1 hover:bg-gray-100 rounded"
              type="button"
            >
              <SquarePen className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </>
    );
  }

  // Edit mode - show form
  return (
    <>
      <h1>A: </h1>
      <form
        action={async (formData) => {
          await answerQuestion(formData);
          setIsEditing(false);
        }}
        className="space-y-2"
      >
        <input type="hidden" name="noteId" value={noteId} />
        <textarea
          name="answer"
          defaultValue={answer || ""}
          className="w-full p-2 border rounded text-sm"
          rows={3}
          placeholder="Provide your feedback..."
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            {answer ? "Update Answer" : "Add Answer"}
          </button>
          {answer && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}
