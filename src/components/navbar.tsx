import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Valorant Coach App
          </Link>

          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
