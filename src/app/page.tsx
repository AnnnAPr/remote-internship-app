"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Job } from "@/types/job";
import JobCard from "@/components/JobCard";
import { Loader2, LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("query") || "";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [activeSearchQuery, setActiveSearchQuery] = useState(initialSearch);
  const [hasSearched, setHasSearched] = useState(!!initialSearch);
  const [isLoading, setIsLoading] = useState(true);

  const [isShowingSavedJobs, setIsShowingSavedJobs] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (data.jobs) setJobs(data.jobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveSearchQuery(searchInput);
    setHasSearched(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", searchInput);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchInput("");
    setActiveSearchQuery("");
    setHasSearched(false);
    router.push(pathname);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleRetrieveSavedJobs = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/jobs/saved");
      const data = await res.json();

      if (data.jobs) {
        setSavedJobs(data.jobs);
        setIsShowingSavedJobs(true);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setIsShowingSavedJobs(false);
  };

  const filteredJobs = useMemo(() => {
    if (isShowingSavedJobs) {
      return savedJobs;
    }

    if (!activeSearchQuery.trim()) return [];
    const query = activeSearchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
    );
  }, [isShowingSavedJobs, activeSearchQuery, jobs, savedJobs]);

  const disolayJobs = isShowingSavedJobs ? savedJobs : filteredJobs;

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30 px-6 py-20 flex flex-col items-center">
      <header className="w-full mb-16 flex flex-col items-center">
        {user && (
          <div className="flex items-center gap-4 absolute top-8 left-8">
            <span className="text-sm font-medium text-zinc-300">
              <span className="text-purple-500">{user.email}</span>
            </span>
            <div className="w-px h-4 bg-zinc-800"></div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-all group"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110" />
              Log Out
            </button>
            {user && (
              <button
                onClick={isShowingSavedJobs ? handleBackToSearch : handleRetrieveSavedJobs}
                className="text-sm font-bold text-purple-500 hover:text-purple-400 transition-colors"
              >
                {isShowingSavedJobs ? "← Back to Search" : "View Saved Jobs"}
              </button>
            )}
          </div>
        )}
        <h1 className="text-6xl md:text-7xl text-center md:text-5xl font-bold mb-6 text-white tracking-tight">
          Remote <span className="text-purple-500">Internship</span> Search
        </h1>

        <p className="text-lg text-zinc-500 mb-10 max-w-2xl">
          Find remote software engineering and data roles from top global companies.
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Enter keyword (e.g. 'Frontend')..."
              className="text-purple-500 placeholder-purple-500 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-lg focus:border-zinc-600 outline-none transition-colors"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-purple-500 text-zinc-950 font-bold py-3 px-8 rounded-lg transition-all active:scale-98"
          >
            <span className="text-zinc-800">Search Jobs</span>
          </button>

          {hasSearched && (
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-8 rounded-lg transition-all active:scale-98"
            >
              <span className="text-purple-500">Reset</span>
            </button>
          )}
        </form>
      </header>

      {/* Main Content after user's search*/}
      <section className="w-full flex flex-col items-center">
        {!hasSearched ? (
          <div className="max-w-xl py-12 rounded-xl flex justify-center">
            <p className="text-center text-zinc-500 px-8 text-2xl">
              Ready to search? Enter a keyword above.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="mb-8">
              {isShowingSavedJobs ? (
                <p className="text-zinc-500 text-center">
                  <span className="text-purple-500 font-bold">Saved Jobs</span>
                </p>
              ) : (
                <p className="text-zinc-500 text-center">
                  <span className="text-purple-500 font-bold">{filteredJobs.length}</span> results
                  found for <span className="text-purple-500">&quot;{activeSearchQuery}&quot;</span>
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-row items-center gap-3 py-10 text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                <p>Loading internships...</p>
              </div>
            ) : disolayJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disolayJobs.map((job) => (
                  <JobCard key={job.id} job={job} initiallySaved={isShowingSavedJobs} />
                ))}
              </div>
            ) : (
              <p className="text-center text-zinc-500 py-6">
                {isShowingSavedJobs ? "No saved jobs yet." : "No jobs found matching your search."}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-10">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
