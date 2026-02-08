"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, UploadCloud } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("videoUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    // Auto-generate title if empty
    if (!data.title) {
      data.title = `Daily Vibe #${Date.now().toString().slice(-4)}`;
    }

    setLoading(true);
    try {
      await apiClient.createVideo(data);
      showNotification("Video published successfully!", "success");

      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-base-100 shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-1">Upload New Reel </h2>
      <p className="text-sm text-gray-500 mb-6">
        Share short videos with your audience
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className="form-control">
          <label className="label font-medium">Title</label>
          <input
            type="text"
            placeholder="Enter reel title"
            className={`input input-bordered w-full h-12 rounded-xl ${
              errors.title ? "input-error" : ""
            }`}
            {...register("title")}
          />
          {errors.title && (
            <span className="text-error text-sm mt-1">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label font-medium">Description</label>
          <textarea
            placeholder="Write something about this reel..."
            rows={4}
            className={`textarea textarea-bordered w-full rounded-xl ${
              errors.description ? "textarea-error" : ""
            }`}
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <span className="text-error text-sm mt-1">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Upload */}
        <div className="form-control">
          <label className="label font-medium">Upload Video</label>

          <div className="border-2 border-dashed border-primary/40 rounded-xl p-5 text-center hover:border-primary transition">
            <UploadCloud className="mx-auto mb-2 opacity-60" />
            <FileUpload
              fileType="video"
              onSuccess={handleUploadSuccess}
              onProgress={handleUploadProgress}
            />
            <p className="text-xs text-gray-500 mt-2">
              MP4 • Vertical • Max 60 seconds
            </p>
          </div>

          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Uploading</span>
                <span>{uploadProgress}%</span>
              </div>
              <progress
                className="progress progress-primary w-full"
                value={uploadProgress}
                max="100"
              />
            </div>
          )}

          {watch("thumbnailUrl") && (
            <img
              src={watch("thumbnailUrl")}
              alt="Thumbnail preview"
              className="rounded-xl mt-4 max-h-48 object-cover mx-auto"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-block h-12 text-base rounded-xl"
          disabled={loading || !uploadProgress}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Reel "
          )}
        </button>
      </form>
    </div>
  );
}
