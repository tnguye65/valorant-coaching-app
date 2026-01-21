import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, SquarePen } from "lucide-react";
import { EditableNote } from "@/components/notes/EditableNote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactPlayer from "react-player";
import { CoachAnswer } from "@/components/notes/CoachAnswer";
import { isMedalVideo, getMedalEmbedUrl } from "@/lib/videoUtils";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ studentId: string; sessionId: string }>;
}) {
  const { userId } = await auth();
  const { studentId, sessionId } = await params;

  if (!userId) {
    redirect("/");
  }

  // Fetch the session with student info
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      student: true,
      sessionNotes: true,
    },
  });

  if (!session) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">Session Not Found</h1>
        <p>The session you are looking for does not exist.</p>
      </div>
    );
  }

  // Find the logged-in user
  const currentUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!currentUser) {
    redirect("/");
  }

  // Security check: Only allow student who owns this session OR coaches
  const isOwner = studentId === currentUser.id;
  const isCoach = currentUser.role === "coach";

  if (!isOwner && !isCoach) {
    redirect("/student/dashboard");
  }

  // Parse review notes from JSON and sort by timestamp
  const sessionNotes = (session.sessionNotes || []).sort(
    (a, b) => a.timestamp - b.timestamp
  );

  // Server Action to add a new question
  async function addQuestion(formData: FormData) {
    "use server";
    const question = formData.get("question") as string;
    const [mins, secs] = formData.get("timestamp").split(":").map(Number);
    const timestamp = mins * 60 + (secs || 0);

    if (!question || question.trim() === "") return;

    // Use 'create' inside the update to handle the relation properly
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        sessionNotes: {
          create: {
            timestamp: timestamp || 0,
            question: question.trim(),
            // sessionId is handled automatically by Prisma because we are inside 'sessionNotes'
          },
        },
      },
    });

    revalidatePath(`coach/students/${studentId}/sessions/${sessionId}`);
  }

  async function updateNote(formData: FormData) {
    "use server";
    const noteId = formData.get("noteId") as string;
    const question = formData.get("question") as string;
    const timestampStr = formData.get("timestamp") as string;

    const [mins, secs] = timestampStr.split(":").map(Number);
    const timestamp = mins * 60 + (secs || 0);

    await prisma.note.update({
      where: { id: noteId },
      data: {
        question: question.trim(),
        timestamp: timestamp,
      },
    });

    revalidatePath(`coach/students/${studentId}/sessions/${sessionId}`);
  }

  async function deleteNote(formData: FormData) {
    "use server";
    const noteId = formData.get("noteId") as string;
    await prisma.note.delete({
      where: { id: noteId },
    });

    revalidatePath(`coach/students/${studentId}/sessions/${sessionId}`);
  }

  async function answerQuestion(formData: FormData) {
    "use server";
    const noteId = formData.get("noteId") as string;
    const answer = formData.get("answer") as string;

    if (!answer || answer.trim() === "") return;

    await prisma.note.update({
      where: { id: noteId },
      data: { answer: answer.trim() },
    });

    revalidatePath(`/coach/students/${studentId}/sessions/${sessionId}`);
  }

  const isMedal = session.vodLink ? isMedalVideo(session.vodLink) : false;
  const medalEmbedUrl =
    isMedal && session.vodLink ? getMedalEmbedUrl(session.vodLink) : null;

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        href={isCoach ? `/coach/students/${studentId}` : "/student/dashboard"}
      >
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to {isCoach ? "Student" : "Dashboard"}
        </button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">
            {session.title || "VOD Review"}
          </h1>
          <Badge
            variant={session.status === "reviewed" ? "default" : "secondary"}
          >
            {session.status}
          </Badge>
        </div>
        <div className="flex gap-4 text-gray-600">
          {session.agent && <span>Agent: {session.agent}</span>}
          {session.map && <span>Map: {session.map}</span>}
          <span>
            {new Date(session.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Video Player */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VOD Recording</CardTitle>
            </CardHeader>
            <CardContent>
              {session.vodLink ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  {isMedal ? (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                      src={medalEmbedUrl || session.vodLink}
                      allow="autoplay"
                      allowFullScreen
                    />
                  ) : (
                    <ReactPlayer
                      url={session.vodLink}
                      controls
                      width="100%"
                      height="100%"
                      config={{
                        youtube: {
                          playerVars: { showinfo: 1 },
                        },
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No VOD link provided</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Questions & Feedback */}
        <div className="space-y-6">
          {/* Student Questions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Student Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionNotes.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {sessionNotes.map((item) => (
                    <EditableNote
                      key={item.id}
                      note={item}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No questions submitted yet
                </p>
              )}

              <hr />
            </CardContent>
          </Card>

          {/* Coach Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Coach Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {sessionNotes.length > 0 ? (
                <div className="space-y-4">
                  {sessionNotes.map((note) => (
                    <div
                      key={note.id}
                      className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded-r"
                    >
                      {/* Question */}
                      <p className="text-sm font-semibold text-gray-500 mb-1">
                        {Math.floor(note.timestamp / 60)}:
                        {(note.timestamp % 60).toString().padStart(2, "0")}
                      </p>
                      <p className="text-gray-800 mb-3 italic">
                        Q: {note.question}
                      </p>

                      {/* Answer Section */}
                      {isCoach ? (
                        <CoachAnswer
                          noteId={note.id}
                          answer={note.answer}
                          answerQuestion={answerQuestion}
                        />
                      ) : (
                        // Student view - just show answer or waiting message
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-gray-700">
                            {note.answer || "⏳ Waiting for coach feedback..."}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No questions submitted yet
                </p>
              )}
              <hr />
            </CardContent>
          </Card>

          {/* General Notes (if any) */}
          {session.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {session.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
