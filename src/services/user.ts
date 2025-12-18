"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateStudentSettings(
  studentId: string,
  gamertag: string,
  rank: string,
  mainAgents: string[]
) {
  try {
    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: { gamertag, rank, mainAgents },
    });

    // Revalidate the student dashboard to reflect the updated settings
    revalidatePath(`/student/settings`);

    return { success: true, student: updatedStudent };
  } catch (error) {
    console.error("Failed to update student settings:", error);
    return { success: false, error: "Failed to update student settings" };
  }
}
