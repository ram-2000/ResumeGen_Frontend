"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { checkHealth } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: checkHealth,
  });

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            ResumeGen
          </Link>
          <div className="flex items-center space-x-8">
            <Link href="/generate" className="text-lg text-gray-600 hover:text-gray-800">
              Generate
            </Link>
            <Link href="/profile" className="text-lg text-gray-600 hover:text-gray-800">
              Profile
            </Link>
            <div className="mr-4">
              {isLoading && <Badge variant="secondary">Checking...</Badge>}
              {isError && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <p>Offline</p>
                </div>
              )}
              {data && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p>Online</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 