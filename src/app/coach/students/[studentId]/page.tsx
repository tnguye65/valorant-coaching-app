import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { CoachRoadmapList } from "@/components/roadmap/CoachRoadmapList";
import { CoachSessionList } from "@/components/sessions/CoachSessionList";
import { EditStudentSettings } from "@/components/user/EditStudentSettings";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  // Fetch student with all related data
  const student = await prisma.user.findUnique({
    where: { id: studentId },
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
            alt={student.gamertag || "Student"}
            width={80}
            height={80}
            className="rounded-full"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {student.gamertag || "Unknown Player"}
          </h1>
          <p className="text-gray-600">{student.email}</p>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Player Information</CardTitle>
          <EditStudentSettings
            studentId={student.id}
            currentGamertag={student.gamertag || ""}
            currentRank={student.rank || ""}
            currentMainAgents={student.mainAgents || []}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-between">
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
      <CoachRoadmapList roadmaps={student.roadmaps} studentId={student.id} />

      {/* Sessions Section */}
      <CoachSessionList sessions={student.sessions} studentId={student.id} />
    </div>
  );
}
