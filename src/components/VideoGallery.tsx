import { useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { VideoCard } from "./VideoCard";
import { VideoPlayer } from "./VideoPlayer";
import { Search, Filter } from "lucide-react";
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
          <h2 className="mb-6 text-[#0A1F44]">Biblioteca de Vídeos</h2>

          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Campo de Busca */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar vídeos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227]"
              />
            </div>

            {/* Filtro de Categoria */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#0A1F44]/60 hidden sm:block" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[240px] border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227]">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Todas as Categorias</span>
                      <span className="text-xs text-muted-foreground">
                        ({videos.length})
                      </span>
                    </div>
                  </SelectItem>
                  {categories.map((category) => {
                    const categoryCount = videos.filter(
                      (v) => v.category === category.name
                    ).length;
                    return (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.label}</span>
                          <span className="text-xs text-muted-foreground">
                            ({categoryCount})
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Indicador de Filtro Ativo */}
          {selectedCategory !== "todos" && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-[#0A1F44]/60">Filtrando por:</span>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A227]/10 rounded-full">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      categories.find((c) => c.name === selectedCategory)
                        ?.color || "#0A1F44",
                  }}
                />
                <span className="text-sm font-medium text-[#0A1F44]">
                  {categories.find((c) => c.name === selectedCategory)?.label}
                </span>
                <button
                  onClick={() => setSelectedCategory("todos")}
                  className="ml-1 text-[#0A1F44]/60 hover:text-[#0A1F44] transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Grid de Vídeos */}
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
