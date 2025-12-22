"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSession(
  studentId: string,
  date: Date,
  notes?: string,
  vodLink?: string
) {
  try {
    const session = await prisma.session.create({
      data: {
        studentId,
        date,
        notes,
        vodLink,
      },
    });

    revalidatePath(`/coach/student/${studentId}`);

    return { success: true, session };
  } catch (error) {
    console.error("Failed to create session:", error);
    return { success: false, error: "Failed to create session" };
  }
}

export async function deleteSession(sessionId: string, studentId: string) {
  try {
    await prisma.session.delete({
      where: { id: sessionId },
    });
    revalidatePath(`/coach/student/${studentId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete session:", error);
    return { success: false, error: "Failed to delete session" };
  }
}

export async function updateSession(
  sessionId: string,
  date: Date,
  notes: string,
  vodLink: string,
  studentId: string
) {
  try {
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { date, notes, vodLink },
    });

    revalidatePath(`/coach/student/${studentId}`);

    return { success: true, session: updatedSession };
  } catch (error) {
    console.error("Failed to update session:", error);
    return { success: false, error: "Failed to update session" };
  }
}
