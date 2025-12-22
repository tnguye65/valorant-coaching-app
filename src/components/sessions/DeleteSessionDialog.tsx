"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteSession } from "@/services/session";
import { Trash } from "lucide-react";

export function DeleteSessionDialog({
  sessionId,
  studentId,
}: {
  sessionId: string;
  studentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    const result = await deleteSession(sessionId, studentId);
    setIsSubmitting(false);

    if (result.success) {
      setOpen(false);
    } else {
      alert("Failed to delete roadmap. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="transition-opacity p-1 hover:bg-red-100 rounded"
          aria-label="Delete session"
        >
          <Trash className="h-4 w-4 text-red-600 cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this session? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleDelete}
            disabled={isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? "Deleting..." : "Delete Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
