"use client";

import { StudentTaskList } from "@/components/task/StudentTaskList";
import { useOptimistic, useTransition } from "react";
import { toggleTaskCompletion } from "@/services/roadmap";
import { Badge } from "@/components/ui/badge";

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

export function StudentRoadmapCard({
  roadmap,
  studentId,
}: {
  roadmap: Roadmap;
  studentId: string;
}) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    roadmap.tasks,
    (state, taskId: string) =>
      state.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
  );

  const [, startTransition] = useTransition();

  const handleToggle = async (taskId: string) => {
    startTransition(async () => {
      setOptimisticTasks(taskId);
      const result = await toggleTaskCompletion(taskId, studentId);
      if (!result.success) {
        alert("Failed to update task");
      }
    });
  };

  const completedTasks = optimisticTasks.filter((t) => t.isCompleted).length;
  const totalTasks = optimisticTasks.length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isActive = roadmap.status === "active";

  return (
    <div className="border rounded-lg p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{roadmap.title}</h3>
          <Badge
            variant={
              roadmap.status === "active"
                ? "default"
                : roadmap.status === "completed"
                ? "secondary"
                : "outline"
            }
          >
            {roadmap.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">
          {completedTasks} of {totalTasks} tasks completed ({progress}%)
        </p>
      </div>

      {/* Task list component /*/}
      <StudentTaskList
        tasks={optimisticTasks}
        onToggle={handleToggle}
        isActive={isActive}
      />
    </div>
  );
}
