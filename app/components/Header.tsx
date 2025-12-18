"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-16">
        {/* Logo */}
        <Link
          href="/"
          onClick={() =>
            showNotification("Welcome to ImageKit ReelsPro", "info")
          }
          className="flex items-center gap-2 font-bold text-xl text-gray-800"
        >
          <Home className="w-5 h-5" />
          Video with AI
        </Link>

        {/* User Menu */}
        <div className="relative group bg-red">
          {/* Icon button */}
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 bg-red">
            <User className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            {session ? (
              <>
                {/* Username */}
                <p className="px-4 py-2 text-sm text-gray-500 border-b">
                  {session.user?.email?.split("@")[0]}
                </p>

                {/* Upload Link */}
                <Link
                  href="/upload"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  Video Upload
                </Link>

                {/* Signout */}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
