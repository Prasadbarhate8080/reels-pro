"use client";
import { IKVideo } from "imagekitio-next";
import { MoveDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");
  const handleSchroll = async () => {
    try {
      const response = await fetch("/api/video");
      if (!response.ok) throw new Error("error in getting videos");
      const videoData = await response.json();
      console.log(videoData);
      router.push(
        `/video/${videoData.data[0]._id}?url=${videoData.data[0].videoUrl}`,
      );
    } catch (error) {
      console.log("error in fetching video", error);
    }
  };
  if (!url) return <div>did no get url</div>;
  return (
    <div
      className=""
      style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <figure className="relative px-4 pt-4">
        <div
          className="rounded-xl overflow-hidden relative"
          style={{ width: "300px", height: "600px",
          }}
        >
          <IKVideo
            path={url}
            transformation={[
              {
                height: "1920",
                width: "1080",
              },
            ]}
            autoPlay
            controls
            className="w-full h-full object-cover"
          />
        </div>
      </figure>
      <div
        style={{ borderRadius: "50%", backgroundColor: "#333", padding: "3px" }}
        onClick={handleSchroll}
      >
        <MoveDown />
      </div>
    </div>
  );
}

