import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Play, Clock, Calendar, TrendingUp } from "lucide-react";
import type { Video, Category } from "../types/content";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoPlayer } from "./VideoPlayer";

interface FeaturedSliderProps {
  videos: Video[];
  categories: Category[];
}

export function FeaturedSlider({ videos, categories }: FeaturedSliderProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Pega apenas vídeos marcados como destaque, ordenados por data
  const featuredVideos = [...videos]
    .filter((video) => video.featured)
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

  const getCategoryLabel = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category?.label || categoryName;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category?.color || "#C9A227";
  };

  return (
    <>
      {featuredVideos.length > 0 && (
        <section className="bg-gradient-to-br from-[#0A1F44] via-[#0A1F44] to-[#1a3a6e] py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-[#C9A227]" />
              <h2 className="text-white">Vídeos em Destaque</h2>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {featuredVideos.map((video) => {
                  const formattedDate = new Date(
                    video.publishDate
                  ).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <CarouselItem
                      key={video.id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="group relative overflow-hidden rounded-lg shadow-xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                          {/* Play button overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              size="lg"
                              className="rounded-full w-16 h-16 bg-[#C9A227] hover:bg-[#b08920] text-white shadow-lg"
                              onClick={() => setSelectedVideo(video)}
                            >
                              <Play className="w-6 h-6 fill-current" />
                            </Button>
                          </div>

                          {/* Category badge */}
                          <div className="absolute top-3 left-3">
                            <Badge
                              className="text-white shadow-lg"
                              style={{
                                backgroundColor: getCategoryColor(
                                  video.category
                                ),
                              }}
                            >
                              {getCategoryLabel(video.category)}
                            </Badge>
                          </div>

                          {/* Duration */}
                          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1 shadow-lg">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </div>

                          {/* Content at bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="text-white mb-2 line-clamp-2">
                              {video.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-white/90">
                              <Calendar className="w-4 h-4" />
                              <span>{formattedDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description section */}
                        <div className="p-4 bg-white">
                          <p className="text-sm text-[#333333] line-clamp-2">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              <CarouselPrevious className="left-2 bg-[#C9A227] hover:bg-[#b08920] text-white border-none shadow-lg" />
              <CarouselNext className="right-2 bg-[#C9A227] hover:bg-[#b08920] text-white border-none shadow-lg" />
            </Carousel>
          </div>
        </section>
      )}

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          categories={categories}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}
