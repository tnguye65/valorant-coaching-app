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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar as CalendarIcon } from "lucide-react";

import { createSession } from "@/services/session";

export function CreateSessionDialog({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [agent, setAgent] = useState("");
  const [map, setMap] = useState("");
  const [title, setTitle] = useState("");
  const [vodLink, setVodLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !title.trim() || !vodLink.trim() || !agent || !map) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const result = await createSession(
      studentId,
      date,
      agent,
      map,
      vodLink,
      title
    );
    setIsSubmitting(false);

    if (result.success) {
      setDate(undefined);
      setAgent("");
      setMap("");
      setTitle("");
      setVodLink("");
      setOpen(false);
    } else {
      alert("Failed to create session. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add VOD for review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add VOD for review</DialogTitle>
            <DialogDescription>
              Create a new coaching session for this student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">
                Session Date <span className="text-red-500">*</span>
              </Label>
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
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Ranked Review, Agent Tips"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vodLink">
                VOD Link <span className="text-red-500">*</span>
              </Label>
              <Input
                id="vodLink"
                type="url"
                placeholder="e.g., https://www.youtube.com/your_vod"
                value={vodLink}
                onChange={(e) => setVodLink(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent">
                Agent <span className="text-red-500">*</span>
              </Label>
              <Select value={agent} onValueChange={setAgent} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent from VOD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Agent</SelectLabel>
                    <SelectItem value="Astra">Astra</SelectItem>
                    <SelectItem value="Breach">Breach</SelectItem>
                    <SelectItem value="Brimstone">Brimstone</SelectItem>
                    <SelectItem value="Chamber">Chamber</SelectItem>
                    <SelectItem value="Clove">Clove</SelectItem>
                    <SelectItem value="Cypher">Cypher</SelectItem>
                    <SelectItem value="Deadlock">Deadlock</SelectItem>
                    <SelectItem value="Fade">Fade</SelectItem>
                    <SelectItem value="Gekko">Gekko</SelectItem>
                    <SelectItem value="Harbor">Harbor</SelectItem>
                    <SelectItem value="Iso">Iso</SelectItem>
                    <SelectItem value="Jett">Jett</SelectItem>
                    <SelectItem value="KAY/O">KAY/O</SelectItem>
                    <SelectItem value="Killjoy">Killjoy</SelectItem>
                    <SelectItem value="Neon">Neon</SelectItem>
                    <SelectItem value="Omen">Omen</SelectItem>
                    <SelectItem value="Phoenix">Phoenix</SelectItem>
                    <SelectItem value="Raze">Raze</SelectItem>
                    <SelectItem value="Reyna">Reyna</SelectItem>
                    <SelectItem value="Sage">Sage</SelectItem>
                    <SelectItem value="Skye">Skye</SelectItem>
                    <SelectItem value="Sova">Sova</SelectItem>
                    <SelectItem value="Tejo">Tejo</SelectItem>
                    <SelectItem value="Veto">Veto</SelectItem>
                    <SelectItem value="Viper">Viper</SelectItem>
                    <SelectItem value="Vyse">Vyse</SelectItem>
                    <SelectItem value="Waylay">Waylay</SelectItem>
                    <SelectItem value="Yoru">Yoru</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="map">
                Map <span className="text-red-500">*</span>
              </Label>
              <Select value={map} onValueChange={setMap} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select map from VOD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Map</SelectLabel>
                    <SelectItem value="Abyss">Abyss</SelectItem>
                    <SelectItem value="Ascent">Ascent</SelectItem>
                    <SelectItem value="Bind">Bind</SelectItem>
                    <SelectItem value="Breeze">Breeze</SelectItem>
                    <SelectItem value="Corrode">Corrode</SelectItem>
                    <SelectItem value="Fracture">Fracture</SelectItem>
                    <SelectItem value="Haven">Haven</SelectItem>
                    <SelectItem value="Icebox">Icebox</SelectItem>
                    <SelectItem value="Lotus">Lotus</SelectItem>
                    <SelectItem value="Pearl">Pearl</SelectItem>
                    <SelectItem value="Split">Split</SelectItem>
                    <SelectItem value="Sunset">Sunset</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              {isSubmitting ? "Creating..." : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
