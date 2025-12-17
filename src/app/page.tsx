import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function Home() {
  // 1. Check if user is logged in via Clerk
  const { userId } = await auth();

  if (userId) {
    // 2. If logged in, fetch their role from YOUR database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    // 3. Redirect based on role
    // Note: If the webhook failed, 'user' might be null.
    // We handle that by redirecting to a setup page or just refreshing.
    if (user?.role === "coach") {
      redirect("/coach/dashboard");
    } else if (user?.role === "student") {
      redirect("/student/dashboard");
    }
  }

  // 4. If NOT logged in, show the Landing Page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <h1 className="text-6xl font-bold mb-4 text-red-500">VALORANT COACH</h1>
      <p className="text-xl text-gray-400 mb-8">Track your road to Immortal.</p>

      <div className="flex gap-4">
        <SignInButton>
          <button className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 font-bold transition">
            Login
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition">
            Apply Now
          </button>
        </SignUpButton>
      </div>
    </div>
  );
}
