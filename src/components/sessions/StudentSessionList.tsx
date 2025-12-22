import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentSessionCard } from "@/components/sessions/StudentSessionCard";

type Session = {
  id: string;
  date: Date;
  notes: string | null;
  vodLink: string | null;
};

export function StudentSessionList({ sessions }: { sessions: Session[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Coaching Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <StudentSessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No coaching sessions recorded yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
