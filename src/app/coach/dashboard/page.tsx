import prisma from "@/lib/db";
import Link from "next/link";

export default async function CoachDashboard() {
  // 1. Fetch all students from the database
  const students = await prisma.user.findMany({
    where: { role: "student" },
    orderBy: { createdAt: "desc" }, // Newest students first
  });

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
            <p className="text-gray-500">Manage your roster and roadmaps.</p>
          </div>
        </div>

        {/* The Student Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {student.username || "Unknown Player"}
                  </h2>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                  {student.rank || "Unranked"}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/coach/students/${student.id}`}
                  className="block w-full text-center py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition"
                >
                  Manage Roadmap →
                </Link>
              </div>
            </div>
          ))}

          {/* Empty State (If you have no students) */}
          {students.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No students found yet.</p>
              <p className="text-sm text-gray-400">Wait for them to sign up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
