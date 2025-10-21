import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import type { Video, Category } from "../types/content";
import { Clock, Calendar } from "lucide-react";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  categories?: Category[];
}

export function VideoPlayer({ video, onClose, categories }: VideoPlayerProps) {
  const formattedDate = new Date(video.publishDate).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
  const category = categories?.find((item) => item.name === video.category);
  const resolvedCategoryLabel = category?.label ?? video.category;
  const badgeStyle = category?.color
    ? { backgroundColor: category.color, color: "#FFFFFF" }
    : undefined;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <div className="aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={video.videoUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-6">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 mb-2">
              <DialogTitle>{video.title}</DialogTitle>
              <Badge style={badgeStyle}>{resolvedCategoryLabel}</Badge>
            </div>
            <DialogDescription>{video.description}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{video.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
