import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentRoadmapList } from "@/components/roadmap/StudentRoadmapList";
import { StudentSessionList } from "@/components/sessions/StudentSessionList";
import { Settings } from "lucide-react";

export default async function StudentDashboard() {
  // Get the logged-in user's Clerk ID
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Find the student in your database using their Clerk ID
  const student = await prisma.user.findUnique({
    where: { clerkUserId: userId },
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

  // If user doesn't exist in your DB yet (webhook might not have fired)
  if (!student) {
    return (
      <div className="p-10">
        <p>Loading your profile...</p>
      </div>
    );
  }

  // Make sure they're actually a student
  if (student.role !== "student") {
    redirect("/coach/dashboard");
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
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
        <Link href="/student/settings">
          <Settings className="h-6 w-6 text-gray-600 cursor-pointer" />
        </Link>
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

      <StudentRoadmapList roadmaps={student.roadmaps} studentId={student.id} />

      {/* Sessions Section */}
      <StudentSessionList sessions={student.sessions} />
    </div>
  );
}
