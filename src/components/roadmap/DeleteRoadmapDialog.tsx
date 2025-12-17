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
import { deleteRoadmap } from "@/services/roadmap";
import { Trash } from "lucide-react";

export function DeleteRoadmapDialog({
  roadmapId,
  studentId,
}: {
  roadmapId: string;
  studentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    const result = await deleteRoadmap(roadmapId, studentId);
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
        <Button variant="destructive">
          <Trash />
          Delete Roadmap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Roadmap</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this roadmap? This action cannot be
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
            {isSubmitting ? "Deleting..." : "Delete Roadmap"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
