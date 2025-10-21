/**
 * Extrai o ID do vídeo do YouTube de uma URL
 */
export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Gera a URL da thumbnail do YouTube baseado na URL do vídeo
 */
export function getYouTubeThumbnail(videoUrl: string): string {
  const videoId = getYouTubeVideoId(videoUrl);

  if (videoId) {
    // Retorna a thumbnail de alta qualidade do YouTube
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  // Fallback para imagem padrão
  return "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800";
}

/**
 * Converte diferentes formatos de URL do YouTube para o padrão de embed
 */
export function getYouTubeEmbedUrl(videoUrl: string): string {
  const videoId = getYouTubeVideoId(videoUrl.trim());

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return videoUrl.trim();
}

/**
 * Normaliza uma URL de vídeo para garantir que o player consiga abrir
 */
export function normalizeVideoUrl(videoUrl: string): string {
  if (!videoUrl) {
    return videoUrl;
  }

  if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
    return getYouTubeEmbedUrl(videoUrl);
  }

  return videoUrl.trim();
}
