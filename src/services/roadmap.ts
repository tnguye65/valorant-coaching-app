// Create roadmap page for coach to view student's roadmaps
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createRoadmap(studentId: string, title: string) {
  try {
    const roadmap = await prisma.roadmap.create({
      data: {
        title,
        status: "active",
        studentId,
      },
    });

    // Revalidate the student page to show the new roadmap
    revalidatePath(`/coach/student/${studentId}`);

    return { success: true, roadmap };
  } catch (error) {
    console.error("Failed to create roadmap:", error);
    return { success: false, error: "Failed to create roadmap" };
  }
}

export async function deleteRoadmap(roadmapId: string, studentId: string) {
  try {
    await prisma.roadmap.delete({
      where: { id: roadmapId },
    });
    // Revalidate the student page to reflect the deleted roadmap
    revalidatePath(`/coach/student/${studentId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete roadmap:", error);
    return { success: false, error: "Failed to delete roadmap" };
  }
}

export async function addTaskToRoadmap(roadmapId: string, description: string) {
  try {
    const task = await prisma.task.create({
      data: {
        description,
        isCompleted: false,
        roadmapId,
      },
    });

    // Revalidate the student page to show the new task
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    if (roadmap) {
      revalidatePath(`/coach/student/${roadmap.studentId}`);
    }

    return { success: true, task };
  } catch (error) {
    console.error("Failed to add task:", error);
    return { success: false, error: "Failed to add task" };
  }
}

export async function toggleTaskCompletion(taskId: string, studentId: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted: !task.isCompleted },
    });

    // Revalidate the student page to reflect the task status change
    revalidatePath(`/coach/student/${studentId}`);

    return { success: true, task: updatedTask };
  } catch (error) {
    console.error("Failed to toggle task completion:", error);
    return { success: false, error: "Failed to toggle task completion" };
  }
}

export async function deleteTask(taskId: string, studentId: string) {
  try {
    await prisma.task.delete({
      where: { id: taskId },
    });

    // Revalidate the student page to reflect the deleted task
    revalidatePath(`/coach/student/${studentId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}
