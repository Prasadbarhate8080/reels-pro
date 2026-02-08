import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { Loader2 } from "lucide-react";

interface VideoFeedProps {
  videos: IVideo[];
  loading?: boolean;
}

function VideoSkeleton() {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm p-3 animate-pulse">
      <div className="w-full aspect-[9/16] bg-base-300 rounded-lg mb-3" />
      <div className="h-4 bg-base-300 rounded w-3/4 mb-2" />
      <div className="h-3 bg-base-300 rounded w-1/2" />
    </div>
  );
}

export default function VideoFeed({ videos, loading = false }: VideoFeedProps) {
  return (
    <div className="w-full px-2 sm:px-4">
      <div className="grid grid-cols-1 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* 🔄 Loading state */}
        {loading &&
          Array.from({ length: 8 }).map((_, i) => <VideoSkeleton key={i} />)}

        {/* ✅ Videos */}
        {!loading &&
          videos.map((video) => (
            <div
              key={video._id?.toString()}
              className="group rounded-xl border border-base-300 bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <VideoComponent video={video} />
            </div>
          ))}

        {/* 📭 Empty state */}
        {!loading && videos.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl opacity-40 mb-4">📹</div>
            <p className="text-lg font-semibold">No videos yet</p>
            <p className="text-sm text-base-content/60 mt-1">
              Upload your first reel to get started
            </p>
          </div>
        )}
      </div>

      {/* Optional global loader (use when grid not visible) */}
      {loading && videos.length === 0 && (
        <div className="flex justify-center mt-8">
          <Loader2 className="w-6 h-6 animate-spin opacity-60" />
        </div>
      )}
    </div>
  );
}
