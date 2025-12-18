// components/TaskList.tsx
"use client";

import { CheckCircle2, Circle, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditTaskDialog } from "@/components/task/EditTaskDialog";

type Task = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
};

export function CoachTaskList({
  tasks,
  studentId,
  onToggle,
  onDelete,
}: {
  tasks: Task[];
  studentId: string;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}) {
  return (
    <>
      {tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded group"
            >
              <div
                className="flex items-start gap-3 flex-1 cursor-pointer"
                onClick={() => onToggle(task.id)}
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

              <EditTaskDialog roadmapId={task.id} studentId={studentId} />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                    aria-label="Delete task"
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this task? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(task.id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No tasks yet</p>
      )}
    </>
  );
}
