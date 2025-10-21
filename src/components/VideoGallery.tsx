import { useState } from "react";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { VideoCard } from "./VideoCard";
import { VideoPlayer } from "./VideoPlayer";
import { Search } from "lucide-react";
import type { Video, Category } from "../types/content";

interface VideoGalleryProps {
  videos: Video[];
  categories: Category[];
}

export function VideoGallery({ videos, categories }: VideoGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "todos" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="videos" className="py-12 bg-white w-full overflow-hidden">
      <div className="container mx-auto px-4 max-w-full">
        <div className="mb-8">
          <h2 className="mb-4 text-[#0A1F44]">Biblioteca de Vídeos</h2>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs
          defaultValue="todos"
          className="w-full max-w-full"
          onValueChange={(value: string) => setSelectedCategory(value)}
        >
          <TabsList className="mb-8 flex-wrap">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.name}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="todos" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={setSelectedVideo}
                  categories={categories}
                />
              ))}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.name}
              className="mt-0"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos
                  .filter((video) => video.category === category.name)
                  .map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onPlay={setSelectedVideo}
                      categories={categories}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum vídeo encontrado com os critérios de busca.
            </p>
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          categories={categories}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
}
