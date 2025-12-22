"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen, Calendar as CalendarIcon } from "lucide-react";
import { updateSession } from "@/services/session";

export function EditSessionDialog({
  sessionId,
  studentId,
  currentDate,
  currentNotes,
  currentVodLink,
}: {
  sessionId: string;
  studentId: string;
  currentDate: Date;
  currentNotes: string;
  currentVodLink: string;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(currentDate);
  const [notes, setNotes] = useState(currentNotes);
  const [vodLink, setVodLink] = useState(currentVodLink);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) return;

    setIsSubmitting(true);
    const result = await updateSession(
      sessionId,
      date,
      notes,
      vodLink,
      studentId
    );
    setIsSubmitting(false);

    if (result.success) {
      setDate(currentDate);
      setNotes("");
      setVodLink("");
      setOpen(false);
    } else {
      alert("Failed to update session. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="transition-opacity p-1 hover:bg-gray-200 rounded"
          aria-label="Edit session"
        >
          <SquarePen className="h-4 w-4 cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>
              Edit the session details below and save your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Session Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={setDate}
                    required
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Session Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="e.g., Focus on improving map awareness"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vodLink">VOD Link (optional)</Label>
              <Input
                id="vodLink"
                placeholder="e.g., https://www.twitch.tv/videos/123456789"
                value={vodLink}
                onChange={(e) => setVodLink(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
