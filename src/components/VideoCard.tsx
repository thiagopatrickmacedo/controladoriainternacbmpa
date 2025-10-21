import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Play, Clock, Calendar } from "lucide-react";
import type { Video, Category } from "../types/content";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface VideoCardProps {
  video: Video;
  categories: Category[];
  onPlay: (video: Video) => void;
}

export function VideoCard({ video, categories, onPlay }: VideoCardProps) {
  const category = categories.find((cat) => cat.name === video.category);
  const categoryLabel = category?.label || video.category;
  const categoryColor = category?.color || "#333333";
  const formattedDate = new Date(video.publishDate).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <ImageWithFallback
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="lg"
            className="rounded-full w-16 h-16 bg-[#C9A227] hover:bg-[#8B0000] text-white"
            onClick={() => onPlay(video)}
          >
            <Play className="w-6 h-6 fill-current" />
          </Button>
        </div>
        <div className="absolute top-2 right-2">
          <Badge
            className="text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryLabel}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{video.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {video.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
