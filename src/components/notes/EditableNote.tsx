"use client";

import { useState } from "react";
import { SquarePen, Trash, Check, X } from "lucide-react";

interface EditableNoteProps {
  note: {
    id: string;
    timestamp: number;
    question: string;
  };
  onDelete: (formData: FormData) => void;
  onUpdate: (formData: FormData) => void;
}

export function EditableNote({ note, onDelete, onUpdate }: EditableNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(note.question);
  const [editedTimestamp, setEditedTimestamp] = useState(
    `${Math.floor(note.timestamp / 60)}:${(note.timestamp % 60)
      .toString()
      .padStart(2, "0")}`
  );

  if (isEditing) {
    return (
      <div className="flex items-start gap-3 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
        <div className="flex-1">
          <input
            type="text"
            value={editedTimestamp}
            onChange={(e) => setEditedTimestamp(e.target.value)}
            placeholder="M:SS"
            className="text-sm font-semibold text-blue-600 mb-2 p-1 border border-blue-300 rounded w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="flex gap-1 mt-3">
          <form
            action={async (formData) => {
              await onUpdate(formData);
              setIsEditing(false);
            }}
          >
            <input type="hidden" name="noteId" value={note.id} />
            <input type="hidden" name="question" value={editedQuestion} />
            <input type="hidden" name="timestamp" value={editedTimestamp} />
            <button
              type="submit"
              className="p-1 hover:bg-green-200 rounded text-green-600"
            >
              <Check className="h-4 w-4" />
            </button>
          </form>
          <button
            onClick={() => {
              setEditedQuestion(note.question);
              setEditedTimestamp(
                `${Math.floor(note.timestamp / 60)}:${(note.timestamp % 60)
                  .toString()
                  .padStart(2, "0")}`
              );
              setIsEditing(false);
            }}
            className="p-1 hover:bg-gray-200 rounded text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded-r transition-colors group">
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-600 mb-1">
          {Math.floor(note.timestamp / 60)}:
          {(note.timestamp % 60).toString().padStart(2, "0")}
        </p>
        <p className="text-gray-700 leading-relaxed">{note.question}</p>
      </div>

      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded text-gray-600 mt-3"
      >
        <SquarePen className="h-4 w-4" />
      </button>

      <form action={onDelete}>
        <input type="hidden" name="noteId" value={note.id} />
        <button type="submit">
          <Trash className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded text-red-600 mt-3" />
        </button>
      </form>
    </div>
  );
}
