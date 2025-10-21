import { useEffect, useState } from "react";
import {
  PlusCircle,
  Video as VideoIcon,
  X,
  Shield,
  CheckCircle2,
  Edit2,
  Trash2,
  Star,
  StarOff,
  Save,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Video, VideoInput, Category } from "../types/content";
import type { UserRole } from "../types/user";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface AdminDashboardProps {
  videos: Video[];
  categories: Category[];
  onAddVideo: (video: VideoInput) => Promise<void> | void;
  onEditVideo: (id: string, video: VideoInput) => Promise<void> | void;
  onDeleteVideo: (id: string) => Promise<void> | void;
  onToggleFeatured: (id: string, featured: boolean) => Promise<void> | void;
  userRole: UserRole;
}

export function AdminDashboard({
  videos,
  categories,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onToggleFeatured,
  userRole,
}: AdminDashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);
  const initialCategory = categories[0]?.name ?? "";
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: initialCategory,
    duration: "",
    thumbnail: "",
    videoUrl: "",
    featured: false,
  });

  useEffect(() => {
    if (!editingId) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0]?.name ?? "",
      }));
    }
  }, [categories, editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.videoUrl) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    const videoData: VideoInput = {
      ...formData,
      publishDate: new Date().toISOString().split("T")[0],
    };

    try {
      if (editingId) {
        await onEditVideo(editingId, videoData);
        toast.success("Vídeo atualizado com sucesso!");
        setEditingId(null);
      } else {
        await onAddVideo(videoData);
        toast.success("Vídeo adicionado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
      toast.error("Não foi possível salvar o vídeo.");
      return;
    }

    // Limpar formulário
    setFormData({
      title: "",
      description: "",
      category: categories[0]?.name ?? "",
      duration: "",
      thumbnail: "",
      videoUrl: "",
      featured: false,
    });

    setIsFormOpen(false);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (video: Video) => {
    setFormData({
      title: video.title,
      description: video.description,
      category: video.category,
      duration: video.duration,
      thumbnail: video.thumbnail,
      videoUrl: video.videoUrl,
      featured: video.featured || false,
    });
    setEditingId(video.id);
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsFormOpen(false);
    setFormData((prev) => ({
      ...prev,
      title: "",
      description: "",
      category: categories[0]?.name ?? "",
      duration: "",
      thumbnail: "",
      videoUrl: "",
      featured: false,
    }));
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteVideo(id);
      toast.success("Vídeo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir vídeo:", error);
      toast.error("Não foi possível excluir o vídeo.");
    } finally {
      setDeleteVideoId(null);
    }
  };

  const getCategoryByName = (categoryName: string) => {
    return categories.find((cat) => cat.name === categoryName);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = getCategoryByName(categoryName);
    return category ? category.color : "#333333";
  };

  const getCategoryLabel = (categoryName: string) => {
    const category = getCategoryByName(categoryName);
    return category ? category.label : categoryName;
  };

  const isAdmin = userRole === "admin";
  const headingTitle = isAdmin
    ? "Painel Administrativo"
    : "Painel do Publicador";
  const headingSubtitle = isAdmin
    ? "Gerenciar vídeos publicados"
    : "Gerenciar vídeos publicados";

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-[#C9A227]/20 border-t-4 border-t-[#C9A227]">
        {/* Header do painel */}
        <div className="bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#C9A227] flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-white mb-1 text-base sm:text-lg">
                  {headingTitle}
                </h2>
                <p className="text-white/80 text-xs sm:text-sm leading-tight">
                  {headingSubtitle}
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                if (categories.length === 0) {
                  return;
                }
                if (isFormOpen && !editingId) {
                  setIsFormOpen(false);
                } else if (isFormOpen && editingId) {
                  handleCancelEdit();
                } else {
                  setIsFormOpen(true);
                }
              }}
              disabled={categories.length === 0}
              className={`${
                isFormOpen
                  ? "bg-[#8B0000] hover:bg-[#8B0000]/90"
                  : "bg-[#C9A227] hover:bg-[#C9A227]/90"
              } text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base`}
            >
              {isFormOpen ? (
                <>
                  <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Adicionar Vídeo
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="p-6">
          {categories.length === 0 && (
            <div className="mb-6 p-4 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-lg">
              <p className="text-sm text-[#333333] text-center">
                ⚠️ Nenhuma categoria disponível. Crie pelo menos uma categoria
                no "Gerenciar Categorias" abaixo para adicionar vídeos.
              </p>
            </div>
          )}

          {isFormOpen && categories.length > 0 && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 mb-8 p-6 bg-[#F2F2F2]/50 rounded-lg border-2 border-[#C9A227]/30"
            >
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-l-4 border-[#C9A227]">
                <CheckCircle2 className="w-5 h-5 text-[#C9A227]" />
                <div className="flex-1">
                  <p className="text-sm text-[#333333]">
                    {editingId ? "Editando vídeo" : "Adicionando novo vídeo"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getCategoryColor(formData.category),
                      }}
                    ></div>
                    <span className="text-xs text-[#333333]">
                      {getCategoryLabel(formData.category)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label
                    htmlFor="title"
                    className="text-[#0A1F44] flex items-center gap-2"
                  >
                    Título do Vídeo <span className="text-[#8B0000]">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Ex: Introdução à Transparência Pública"
                    className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-[#0A1F44]">
                    Descrição <span className="text-[#8B0000]">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Descreva o conteúdo do vídeo de forma clara e objetiva..."
                    className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] min-h-[100px] bg-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-[#0A1F44]">
                    Categoria <span className="text-[#8B0000]">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) =>
                      handleChange("category", value)
                    }
                  >
                    <SelectTrigger className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-[#0A1F44]">
                    Duração (mm:ss)
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    placeholder="Ex: 15:30"
                    className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="videoUrl" className="text-[#0A1F44]">
                    URL do Vídeo <span className="text-[#8B0000]">*</span>
                  </Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => handleChange("videoUrl", e.target.value)}
                    placeholder="Ex: https://www.youtube.com/embed/..."
                    className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-white"
                    required
                  />
                  <p className="text-xs text-[#333333]/60 mt-2 flex items-center gap-1">
                    <VideoIcon className="w-3 h-3" />
                    Cole a URL do embed do YouTube ou outro serviço de vídeo
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="thumbnail" className="text-[#0A1F44]">
                    URL da Thumbnail (Miniatura) - Opcional
                  </Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => handleChange("thumbnail", e.target.value)}
                    placeholder="Ex: https://images.unsplash.com/photo-..."
                    className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-white"
                  />
                  <p className="text-xs text-[#333333]/60 mt-2">
                    Deixe em branco para usar automaticamente a thumbnail do
                    vídeo (funciona com YouTube)
                  </p>
                </div>

                <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white rounded-lg border border-[#C9A227]/20">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleChange("featured", e.target.checked)}
                    className="w-5 h-5 rounded border-[#0A1F44] text-[#C9A227] focus:ring-[#C9A227]"
                  />
                  <Label
                    htmlFor="featured"
                    className="text-[#0A1F44] cursor-pointer flex items-center gap-2"
                  >
                    <Star className="w-4 h-4 text-[#C9A227]" />
                    Marcar como vídeo em destaque
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-[#C9A227]/20">
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white shadow-md hover:shadow-lg transition-all border-2 border-[#C9A227]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Salvar Alterações" : "Publicar Vídeo"}
                </Button>
              </div>
            </form>
          )}

          {/* Lista de vídeos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-[#0A1F44] text-sm sm:text-base">
                Vídeos Publicados ({videos.length})
              </h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#333333]/70">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#C9A227] fill-[#C9A227]" />
                <span>
                  {videos.filter((v) => v.featured).length} em destaque
                </span>
              </div>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-16 bg-[#F2F2F2]/50 rounded-lg">
                <VideoIcon className="w-12 h-12 text-[#C9A227] mx-auto mb-4 opacity-50" />
                <p className="text-[#333333]">Nenhum vídeo publicado</p>
                <p className="text-[#333333]/60 text-sm mt-2">
                  Clique em "Adicionar Vídeo" para publicar o primeiro conteúdo
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white border border-[#C9A227]/20 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      {/* Thumbnail */}
                      <div className="w-full sm:w-32 aspect-video sm:aspect-auto sm:h-20 rounded overflow-hidden bg-[#F2F2F2] flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Informações */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              <h4 className="text-[#0A1F44] text-sm sm:text-base line-clamp-2 flex-1">
                                {video.title}
                              </h4>
                              {video.featured && (
                                <Star className="w-4 h-4 text-[#C9A227] fill-[#C9A227] flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-[#333333]/70 line-clamp-2 mb-2">
                              {video.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                className="text-white text-xs"
                                style={{
                                  backgroundColor: getCategoryColor(
                                    video.category
                                  ),
                                }}
                              >
                                {getCategoryLabel(video.category)}
                              </Badge>
                              {video.duration && (
                                <span className="text-xs text-[#333333]/60">
                                  {video.duration}
                                </span>
                              )}
                              <span className="text-xs text-[#333333]/60">
                                {new Date(video.publishDate).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Ações */}
                          <div className="flex items-center gap-2 justify-start">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onToggleFeatured(
                                  video.id,
                                  !(video.featured ?? false)
                                )
                              }
                              className={`border-[#C9A227] ${
                                video.featured
                                  ? "bg-[#C9A227] text-white hover:bg-[#b08920]"
                                  : "text-[#C9A227] hover:bg-[#C9A227] hover:text-white"
                              } transition-all flex-1 sm:flex-initial`}
                              title={
                                video.featured
                                  ? "Remover do destaque"
                                  : "Adicionar ao destaque"
                              }
                            >
                              {video.featured ? (
                                <StarOff className="w-3 h-3 sm:w-4 sm:h-4" />
                              ) : (
                                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(video)}
                              className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white transition-all flex-1 sm:flex-initial"
                            >
                              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteVideoId(video.id)}
                              className="border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white transition-all flex-1 sm:flex-initial"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog
        open={!!deleteVideoId}
        onOpenChange={() => setDeleteVideoId(null)}
      >
        <AlertDialogContent className="bg-white border-2 border-[#8B0000]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#8B0000] flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#333333]">
              Tem certeza que deseja excluir este vídeo? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#333333] text-[#333333] hover:bg-[#F2F2F2]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteVideoId && handleDelete(deleteVideoId)}
              className="bg-[#8B0000] hover:bg-[#8B0000]/90 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
