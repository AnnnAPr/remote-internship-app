import { Job } from "@/types/job";
import {
	MapPin,
	Clock,
	DollarSign,
	Building2,
} from "lucide-react";

interface JobCardProps {
	job: Job;
}

export default function JobCard({ job }: JobCardProps) {
	const formatPostedAt = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "Yesterday";
		return `${diffDays} days ago`;
	};

	return (
		<div className="w-full max-w-md flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors text-left">
			<div className="p-6 pb-4 flex flex-col items-start gap-4">
				<div className="flex flex-row items-center gap-3 w-full">
					<Building2 className="w-4 h-4 text-zinc-500" />
					<span className="text-sm font-medium text-zinc-400">
						{job.company}
					</span>
					<span className="ml-auto text-[10px] px-2 py-0.5 rounded border border-zinc-800 text-zinc-500 uppercase font-bold">
						{job.category}
					</span>
				</div>

				<h3 className="text-xl font-bold text-white leading-tight">
					{job.title}
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
						<span key={i} className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded text-[11px] font-medium">
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
					className="w-full bg-white text-zinc-950 text-center py-2.5 rounded-md font-bold text-sm hover:bg-zinc-200 transition-colors"
				>
					Apply
				</a>
				<button
					onClick={() => { }}
					className="w-full py-2.5 rounded-md border border-zinc-800 text-zinc-400 text-sm font-semibold hover:bg-zinc-800 transition-colors"
				>
					AI Summary
				</button>
			</div>
		</div>
	);
}
