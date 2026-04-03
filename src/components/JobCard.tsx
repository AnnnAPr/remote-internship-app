import { Job } from "@/types/job";
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { JobCardProps } from "@/types/job";

export default function JobCard({ job, initiallySaved = false }: JobCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const formatPostedAt = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const handleSammary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const res = await fetch("/api/jobs/summary", {
        method: "POST",
        body: JSON.stringify({
          job: { title: job.title, description: job.description, company: job.company },
        }),
      });

      console.log("RES: ", res);

      if (!res.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await res.json();
      console.log("DATA in summary: ", data.summary);
      setSummary(data.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      setError("Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJob = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/jobs/save", {
        method: "POST",
        body: JSON.stringify({ job }),
      });

      if (res.status === 401) {
        setShowSignIn(true);
        return;
      }

      if (res.ok) {
        setIsSaved(true);
        setShowSignIn(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSigning(true);
    const supabase = createClient();
    const currentPath = window.location.pathname + window.location.search;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(currentPath)}`,
      },
    });
  };

  return (
    <div className="w-full max-w-md flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors text-left">
      <div className="p-6 pb-4 flex flex-col items-start gap-4">
        <div className="flex flex-row items-center gap-3 w-full">
          <Building2 className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-400">{job.company}</span>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded border border-zinc-800 text-white uppercase font-bold">
            {job.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white leading-tight">
          <span className="text-purple-500">{job.title}</span>
        </h3>

        <div className="flex flex-col gap-2 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </div>
          {job.salary && (
            <div className="flex items-center gap-2 text-zinc-400">
              <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
              {job.salary}
            </div>
          )}
          <div className="flex items-center gap-2 opacity-60">
            <Clock className="w-3.5 h-3.5" />
            {formatPostedAt(job.postedAt)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {job.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded text-[11px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 pt-2 pb-6 border-t border-zinc-800/50 mt-auto flex flex-col gap-3">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-purple-500 text-zinc-950 text-center py-2.5 rounded-md font-bold text-sm hover:bg-purple-400 transition-colors"
        >
          Apply
        </a>
        <button
          onClick={handleSammary}
          className="w-full py-2.5 rounded-md border border-zinc-800 text-zinc-400 text-sm font-semibold hover:bg-zinc-800 transition-colors"
        >
          {isLoading ? "Summarizing..." : "AI Summary"}
        </button>
        {summary && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSummary(null)}
          >
            <div
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-md w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-purple-500">Job Summary</h3>
                <ul className="space-y-3">
                  {summary.split("\n").map((point, index) => (
                    <li key={index} className="text-sm text-zinc-300 leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 w-full py-2 bg-purple-500 hover:bg-purple-400 text-zinc-950 rounded font-semibold text-sm"
                  onClick={() => setSummary(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSaveJob}
          disabled={isSaving || isSaved}
          className={`w-full py-2.5 rounded-md border text-sm font-semibold transition-all ${
            isSaved
              ? "border-purple-500/50 text-purple-500 bg-purple-500/5 cursor-default"
              : "border-zinc-800 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Job"}
        </button>
        {showSignIn && (
          <button
            onClick={handleGoogleLogin}
            disabled={isSigning}
            className="bg-purple-200 text-zinc-950 px-4 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors animate-in fade-in slide-in-from-top-2"
          >
            {isSigning ? (
              "Signing In..."
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign In to Save
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
