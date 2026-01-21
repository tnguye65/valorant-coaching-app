import { EditSessionDialog } from "./EditSessionDialog";
import { DeleteSessionDialog } from "./DeleteSessionDialog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Session = {
  id: string;
  date: Date;
  notes: string | null;
  vodLink: string | null;
};

export function CoachSessionCard({
  session,
  studentId,
}: {
  session: Session;
  studentId: string;
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-semibold">{session.title}</h1>
          <p className="font-normal text-sm text-gray-600">
            {new Date(session.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-1 text-sm text-gray-700">Agent: {session.agent}</p>
          <p className="text-sm text-gray-700">Map: {session.map}</p>
        </div>

        <div className="flex gap-2">
          {/* Edit Session Button */}
          <EditSessionDialog
            sessionId={session.id}
            studentId={studentId}
            currentDate={session.date}
            currentNotes={session.notes || ""}
            currentVodLink={session.vodLink || ""}
          />

          {/* Delete Session Button */}
          <DeleteSessionDialog sessionId={session.id} studentId={studentId} />

          <Link
            href={`/coach/students/${studentId}/sessions/${session.id}`}
            key={session.id}
          >
            <ArrowRight className="h-5 w-5 text-gray-400"></ArrowRight>
          </Link>
        </div>
      </div>
    </div>
  );
}
