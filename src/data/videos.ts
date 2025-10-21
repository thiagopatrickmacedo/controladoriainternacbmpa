export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  publishDate: string;
  featured?: boolean;
}

export const videos: Video[] = [
  {
    id: "1",
    title: "Introdução à Transparência Pública",
    description: "Entenda os princípios básicos da transparência na administração pública e sua importância para a sociedade.",
    category: "transparencia",
    duration: "15:30",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    publishDate: "2025-10-01",
    featured: true
  },
  {
    id: "2",
    title: "Lei de Acesso à Informação - LAI",
    description: "Como funciona a LAI e quais são os direitos dos cidadãos no acesso a informações públicas.",
    category: "transparencia",
    duration: "22:15",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    publishDate: "2025-09-28",
    featured: true
  },
  {
    id: "3",
    title: "Técnicas de Monitoramento de Contratos",
    description: "Aprenda técnicas eficazes para monitorar contratos públicos e identificar irregularidades.",
    category: "monitoramento",
    duration: "18:45",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    publishDate: "2025-09-25",
    featured: true
  },
  {
    id: "4",
    title: "Auditoria em Processos Licitatórios",
    description: "Passo a passo para realizar auditoria em processos de licitação e compras públicas.",
    category: "monitoramento",
    duration: "25:10",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    publishDate: "2025-09-20"
  },
  {
    id: "5",
    title: "Ferramentas de Controle Interno",
    description: "Conheça as principais ferramentas e sistemas utilizados no controle interno do CBMPA.",
    category: "capacitacao",
    duration: "20:30",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    publishDate: "2025-09-15"
  },
  {
    id: "6",
    title: "Ética e Integridade no Serviço Público",
    description: "Discussão sobre princípios éticos e a importância da integridade na gestão pública.",
    category: "capacitacao",
    duration: "17:20",
    thumbnail: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    publishDate: "2025-09-10"
  },
  {
    id: "7",
    title: "Portal da Transparência - Navegação e Consultas",
    description: "Tutorial completo sobre como utilizar o Portal da Transparência para consultar informações públicas.",
    category: "transparencia",
    duration: "12:40",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    publishDate: "2025-09-05"
  },
  {
    id: "8",
    title: "Indicadores de Desempenho em Controle Interno",
    description: "Como definir e acompanhar indicadores de desempenho para avaliar a eficácia do controle interno.",
    category: "monitoramento",
    duration: "19:55",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    publishDate: "2025-08-30"
  }
];