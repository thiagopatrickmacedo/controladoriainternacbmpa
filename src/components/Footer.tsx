import { Shield, Mail, Phone, MapPin, Globe } from "lucide-react";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import type { FooterConfig } from "../types/content";

interface FooterProps {
  footerConfig: FooterConfig | null;
}

const contactIcons = {
  email: Mail,
  phone: Phone,
  whatsapp: WhatsAppIcon,
  location: MapPin,
  website: Globe,
};

export function Footer({ footerConfig }: FooterProps) {
  const defaultDescription =
    "Promovendo a transparência e o controle efetivo dos recursos públicos do Corpo de Bombeiros Militar do Pará.";

  const sortedLinks = footerConfig?.links
    ? [...footerConfig.links].sort((a, b) => a.order - b.order)
    : [];

  const sortedContacts = footerConfig?.contacts
    ? [...footerConfig.contacts].sort((a, b) => a.order - b.order)
    : [];
  return (
    <footer className="bg-[#0A1F44] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#C9A227] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white">Controladoria Interna</h3>
                <p className="text-white/80 text-sm">CBMPA</p>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              {footerConfig?.description || defaultDescription}
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">Contato</h4>
            <div className="space-y-3">
              {sortedContacts.length > 0 ? (
                sortedContacts.map((contact) => {
                  const Icon = contactIcons[contact.type];
                  return (
                    <div
                      key={contact.id}
                      className="flex items-center gap-2 text-white/80 text-sm"
                    >
                      <Icon className="w-4 h-4 text-[#C9A227]" />
                      <span>{contact.value}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-white/60 text-sm italic">
                  Nenhum contato cadastrado
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4">Links Úteis</h4>
            <ul className="space-y-2">
              {sortedLinks.length > 0 ? (
                sortedLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-[#C9A227] text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))
              ) : (
                <p className="text-white/60 text-sm italic">
                  Nenhum link cadastrado
                </p>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/70 text-sm">
            © 2025 Controladoria Interna - CBMPA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
