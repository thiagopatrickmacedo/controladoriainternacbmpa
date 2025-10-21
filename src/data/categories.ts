export interface Category {
  id: string;
  name: string;
  label: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: "transparencia",
    name: "transparencia",
    label: "Transparência",
    color: "#0A1F44",
  },
  {
    id: "monitoramento",
    name: "monitoramento",
    label: "Monitoramento",
    color: "#8B0000",
  },
  {
    id: "capacitacao",
    name: "capacitacao",
    label: "Capacitação",
    color: "#C9A227",
  },
];
