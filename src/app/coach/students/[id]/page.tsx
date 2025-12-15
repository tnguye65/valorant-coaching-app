import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, CheckCircle2, Circle } from "lucide-react";
import { CreateRoadmapDialog } from "@/components/CreateRoadmapDialog";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch student with all related data
  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      roadmaps: {
        include: { tasks: true },
        orderBy: { createdAt: "desc" },
      },
      sessions: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!student) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">Student Not Found</h1>
        <p>The student you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link href="/coach/dashboard">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Student Header */}
      <div className="flex items-center gap-6 mb-8">
        {student.imageUrl && (
          <Image
            src={student.imageUrl}
            alt={student.username || "Student"}
            width={80}
            height={80}
            className="rounded-full"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {student.username || "Unknown Player"}
          </h1>
          <p className="text-gray-600">{student.email}</p>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Player Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Gamertag</p>
              <p className="font-semibold">{student.gamertag || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Rank</p>
              <p className="font-semibold">{student.rank || "Unranked"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Main Agents</p>
              <div className="flex gap-2 flex-wrap mt-1">
                {student.mainAgents && student.mainAgents.length > 0 ? (
                  student.mainAgents.map((agent) => (
                    <Badge key={agent} variant="secondary">
                      {agent}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">None selected</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmaps Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Roadmaps</CardTitle>
          <CreateRoadmapDialog studentId={student.id} />
        </CardHeader>
        <CardContent>
          {student.roadmaps && student.roadmaps.length > 0 ? (
            <div className="space-y-4">
              {student.roadmaps.map((roadmap) => {
                const completedTasks = roadmap.tasks.filter(
                  (t) => t.isCompleted
                ).length;
                const totalTasks = roadmap.tasks.length;
                const progress =
                  totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0;

                return (
                  <div key={roadmap.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {roadmap.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {completedTasks} of {totalTasks} tasks completed (
                          {progress}%)
                        </p>
                      </div>
                      <Badge
                        variant={
                          roadmap.status === "active" ? "default" : "secondary"
                        }
                      >
                        {roadmap.status}
                      </Badge>
                    </div>

                    {/* Task List */}
                    {roadmap.tasks.length > 0 ? (
                      <div className="space-y-2">
                        {roadmap.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded"
                          >
                            {task.isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <p
                                className={
                                  task.isCompleted
                                    ? "line-through text-gray-500"
                                    : ""
                                }
                              >
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No tasks yet</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">
              No roadmaps created yet. Create one to get started!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sessions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Coaching Sessions</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Session
          </Button>
        </CardHeader>
        <CardContent>
          {student.sessions && student.sessions.length > 0 ? (
            <div className="space-y-4">
              {student.sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {session.vodLink && (
                      <a
                        href={session.vodLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View VOD
                      </a>
                    )}
                  </div>
                  {session.notes ? (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {session.notes}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No notes for this session
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No coaching sessions recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
