"use client";

import { updateStudentSettings } from "@/services/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import { useState } from "react";

export function EditStudentSettings({
  studentId,
  currentGamertag,
  currentRank,
  currentMainAgents,
}: {
  studentId: string;
  currentGamertag: string;
  currentRank: string;
  currentMainAgents: string[];
}) {
  const [open, setOpen] = useState(false);
  const [gamertag, setGamertag] = useState(currentGamertag);
  const [rank, setRank] = useState(currentRank);
  const [mainAgents, setMainAgents] = useState<string[]>(currentMainAgents);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gamertag.trim() || !rank.trim()) return;

    setIsSubmitting(true);

    const result = await updateStudentSettings(
      studentId,
      gamertag.trim(),
      rank.trim(),
      mainAgents
    );
    setIsSubmitting(false);

    console.log("Agents sent:", mainAgents); // ADD THIS

    if (result.success) {
      setOpen(false);
    } else {
      alert("Failed to update settings. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SquarePen className="h-6 w-6 text-gray-600 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Player Settings</DialogTitle>
            <DialogDescription>Update player details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="gamertag">Gamertag</Label>
              <Input
                id="gamertag"
                value={gamertag}
                onChange={(e) => setGamertag(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rank">Rank</Label>
              <Select value={rank} onValueChange={setRank}>
                <SelectTrigger id="rank">
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Rank</SelectLabel>
                    <SelectItem value="Iron">Iron</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Diamond">Diamond</SelectItem>
                    <SelectItem value="Ascendant">Ascendant</SelectItem>
                    <SelectItem value="Immortal">Immortal</SelectItem>
                    <SelectItem value="Radiant">Radiant</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mainAgents">Main Agents</Label>
              <MultiSelect values={mainAgents} onValuesChange={setMainAgents}>
                <MultiSelectTrigger>
                  <MultiSelectValue
                    placeholder="Select main agents"
                    overflowBehavior="wrap"
                  />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    <MultiSelectItem value="Astra">Astra</MultiSelectItem>
                    <MultiSelectItem value="Breach">Breach</MultiSelectItem>
                    <MultiSelectItem value="Brimstone">
                      Brimstone
                    </MultiSelectItem>
                    <MultiSelectItem value="Chamber">Chamber</MultiSelectItem>
                    <MultiSelectItem value="Clove">Clove</MultiSelectItem>
                    <MultiSelectItem value="Cypher">Cypher</MultiSelectItem>
                    <MultiSelectItem value="Deadlock">Deadlock</MultiSelectItem>
                    <MultiSelectItem value="Fade">Fade</MultiSelectItem>
                    <MultiSelectItem value="Gekko">Gekko</MultiSelectItem>
                    <MultiSelectItem value="Harbor">Harbor</MultiSelectItem>
                    <MultiSelectItem value="Iso">Iso</MultiSelectItem>
                    <MultiSelectItem value="Jett">Jett</MultiSelectItem>
                    <MultiSelectItem value="KAY/O">KAY/O</MultiSelectItem>
                    <MultiSelectItem value="Killjoy">Killjoy</MultiSelectItem>
                    <MultiSelectItem value="Neon">Neon</MultiSelectItem>
                    <MultiSelectItem value="Omen">Omen</MultiSelectItem>
                    <MultiSelectItem value="Phoenix">Phoenix</MultiSelectItem>
                    <MultiSelectItem value="Raze">Raze</MultiSelectItem>
                    <MultiSelectItem value="Reyna">Reyna</MultiSelectItem>
                    <MultiSelectItem value="Sage">Sage</MultiSelectItem>
                    <MultiSelectItem value="Skye">Skye</MultiSelectItem>
                    <MultiSelectItem value="Sova">Sova</MultiSelectItem>
                    <MultiSelectItem value="Tejo">Tejo</MultiSelectItem>
                    <MultiSelectItem value="Veto">Veto</MultiSelectItem>
                    <MultiSelectItem value="Viper">Viper</MultiSelectItem>
                    <MultiSelectItem value="Vyse">Vyse</MultiSelectItem>
                    <MultiSelectItem value="Waylay">Waylay</MultiSelectItem>
                    <MultiSelectItem value="Yoru">Yoru</MultiSelectItem>
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
