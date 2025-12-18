"use client";

import { CheckCircle2, Circle } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
};

export function StudentTaskList({
  tasks,
  onToggle,
  isActive,
}: {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  isActive: boolean;
}) {
  return (
    <>
      {tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-3 p-2 rounded ${
                isActive
                  ? "cursor-pointer hover:bg-gray-50"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={isActive ? () => onToggle(task.id) : undefined}
            >
              {task.isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={
                    task.isCompleted ? "line-through text-gray-500" : ""
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
        <p className="text-sm text-gray-400">No tasks assigned yet</p>
      )}
    </>
  );
}
