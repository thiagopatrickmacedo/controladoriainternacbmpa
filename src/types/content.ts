export interface Category {
  id: string;
  name: string;
  label: string;
  color: string;
}

export type CategoryInput = Omit<Category, "id">;

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
  createdAt?: string;
}

export type VideoInput = Omit<Video, "id">;

export type ContactType = "email" | "phone" | "whatsapp" | "location" | "website";

export interface FooterContact {
  id: string;
  type: ContactType;
  label: string;
  value: string;
  order: number;
}

export type FooterContactInput = Omit<FooterContact, "id">;

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

export type FooterLinkInput = Omit<FooterLink, "id">;

export interface FooterConfig {
  id: string;
  description: string;
  links: FooterLink[];
  contacts: FooterContact[];
}
