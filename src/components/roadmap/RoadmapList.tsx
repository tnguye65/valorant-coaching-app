import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRoadmapDialog } from "@/components/roadmap/CreateRoadmapDialog";
import { RoadmapCard } from "@/components/roadmap/RoadmapCard";

type Task = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
};

type Roadmap = {
  id: string;
  title: string;
  tasks: Task[];
};

export function RoadmapList({
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
        <CreateRoadmapDialog studentId={studentId} />
      </CardHeader>
      <CardContent>
        {roadmaps && roadmaps.length > 0 ? (
          <div className="space-y-4">
            {roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                studentId={studentId}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            No roadmaps created yet. Create one to get started!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
