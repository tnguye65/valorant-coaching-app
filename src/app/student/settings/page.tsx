import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EditStudentSettings } from "@/components/user/EditStudentSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

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
        <Link href="/student/dashboard">
          <ArrowLeft className="h-6 w-6 text-gray-600 cursor-pointer" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">{student.email || "Not set"}</p>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Account Details</CardTitle>
          <EditStudentSettings
            studentId={student.id}
            currentGamertag={student.gamertag || ""}
            currentRank={student.rank || ""}
            currentMainAgents={student.mainAgents || []}
          />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-lg font-medium">
              <p className="text-lg">
                <span className="font-semibold">Gamertag:</span>{" "}
                <span className="text-gray-600">
                  {student.gamertag || "Not set"}
                </span>
              </p>
              <p className="text-lg">
                <span className="font-semibold">Rank:</span>{" "}
                <span className="text-gray-600">
                  {student.rank || "Not set"}
                </span>
              </p>
              <p className="text-lg">
                <span className="font-semibold">Agents:</span>{" "}
                <span className="text-gray-600">
                  {student.mainAgents && student.mainAgents.length > 0
                    ? student.mainAgents.join(", ")
                    : "Not set"}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
