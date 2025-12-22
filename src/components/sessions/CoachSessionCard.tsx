import { EditSessionDialog } from "./EditSessionDialog";
import { DeleteSessionDialog } from "./DeleteSessionDialog";

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
        <p className="font-semibold">
          {new Date(session.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

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
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {session.notes ? (
          <p className="text-gray-700 whitespace-pre-wrap">{session.notes}</p>
        ) : (
          <p className="text-gray-400 text-sm">No notes for this session</p>
        )}

        {session.vodLink ? (
          <a
            href={session.vodLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View VOD
          </a>
        ) : (
          <p className="text-gray-400 text-sm">No VOD link provided</p>
        )}
      </div>
    </div>
  );
}
