import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentRoadmapCard } from "@/components/roadmap/StudentRoadmapCard";

type Task = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
};

type Roadmap = {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
};

export function StudentRoadmapList({
  roadmaps,
  studentId,
}: {
  roadmaps: Roadmap[];
  studentId: string;
}) {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Roadmaps</CardTitle>
      </CardHeader>
      <CardContent>
        {roadmaps && roadmaps.length > 0 ? (
          <div className="space-y-4">
            {roadmaps.map((roadmap) => (
              <StudentRoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                studentId={studentId}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            No roadmaps created yet. Your coach will create one for you soon!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
