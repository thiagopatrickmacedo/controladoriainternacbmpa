import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { Plus, Trash2, Edit2 } from "lucide-react";
import type {
  FooterConfig,
  FooterLink,
  FooterContact,
  ContactType,
} from "../types/content";
import { toast } from "sonner";

interface FooterManagerProps {
  footerConfig: FooterConfig | null;
  onUpdateDescription: (description: string) => Promise<void>;
  onAddLink: (link: Omit<FooterLink, "id">) => Promise<void>;
  onEditLink: (id: string, link: Omit<FooterLink, "id">) => Promise<void>;
  onDeleteLink: (id: string) => Promise<void>;
  onAddContact: (contact: Omit<FooterContact, "id">) => Promise<void>;
  onEditContact: (
    id: string,
    contact: Omit<FooterContact, "id">
  ) => Promise<void>;
  onDeleteContact: (id: string) => Promise<void>;
}

const contactTypeLabels: Record<ContactType, string> = {
  email: "Email",
  phone: "Telefone",
  whatsapp: "WhatsApp",
  location: "Localização",
  website: "Website",
};

export function FooterManager({
  footerConfig,
  onUpdateDescription,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onAddContact,
  onEditContact,
  onDeleteContact,
}: FooterManagerProps) {
  const [description, setDescription] = useState(
    footerConfig?.description || ""
  );
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Links state
  const [linkForm, setLinkForm] = useState<{
    label: string;
    url: string;
    order: number;
  }>({ label: "", url: "", order: 0 });
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  // Contacts state
  const [contactForm, setContactForm] = useState<{
    type: ContactType;
    label: string;
    value: string;
    order: number;
  }>({ type: "email", label: "", value: "", order: 0 });
  const [editingContact, setEditingContact] = useState<FooterContact | null>(
    null
  );
  const [deletingContactId, setDeletingContactId] = useState<string | null>(
    null
  );

  const sortedLinks = footerConfig?.links
    ? [...footerConfig.links].sort((a, b) => a.order - b.order)
    : [];

  const sortedContacts = footerConfig?.contacts
    ? [...footerConfig.contacts].sort((a, b) => a.order - b.order)
    : [];

  const handleSaveDescription = async () => {
    if (!description.trim()) {
      toast.error("A descrição não pode estar vazia");
      return;
    }
    try {
      await onUpdateDescription(description);
      setIsEditingDescription(false);
      toast.success("Descrição atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar descrição");
    }
  };

  const handleAddLink = async () => {
    if (!linkForm.label.trim() || !linkForm.url.trim()) {
      toast.error("Preencha todos os campos do link");
      return;
    }

    try {
      const maxOrder =
        sortedLinks.length > 0
          ? Math.max(...sortedLinks.map((l) => l.order))
          : 0;
      await onAddLink({
        label: linkForm.label,
        url: linkForm.url,
        order: maxOrder + 1,
      });
      setLinkForm({ label: "", url: "", order: 0 });
      toast.success("Link adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar link");
    }
  };

  const handleEditLink = async () => {
    if (!editingLink) return;
    if (!linkForm.label.trim() || !linkForm.url.trim()) {
      toast.error("Preencha todos os campos do link");
      return;
    }

    try {
      await onEditLink(editingLink.id, {
        label: linkForm.label,
        url: linkForm.url,
        order: linkForm.order,
      });
      setEditingLink(null);
      setLinkForm({ label: "", url: "", order: 0 });
      toast.success("Link atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar link");
    }
  };

  const handleDeleteLink = async () => {
    if (!deletingLinkId) return;
    try {
      await onDeleteLink(deletingLinkId);
      setDeletingLinkId(null);
      toast.success("Link removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover link");
    }
  };

  const handleAddContact = async () => {
    if (!contactForm.value.trim()) {
      toast.error("Preencha o valor do contato");
      return;
    }

    try {
      const maxOrder =
        sortedContacts.length > 0
          ? Math.max(...sortedContacts.map((c) => c.order))
          : 0;
      await onAddContact({
        type: contactForm.type,
        label: contactForm.label || contactTypeLabels[contactForm.type],
        value: contactForm.value,
        order: maxOrder + 1,
      });
      setContactForm({ type: "email", label: "", value: "", order: 0 });
      toast.success("Contato adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar contato");
    }
  };

  const handleEditContact = async () => {
    if (!editingContact) return;
    if (!contactForm.value.trim()) {
      toast.error("Preencha o valor do contato");
      return;
    }

    try {
      await onEditContact(editingContact.id, {
        type: contactForm.type,
        label: contactForm.label || contactTypeLabels[contactForm.type],
        value: contactForm.value,
        order: contactForm.order,
      });
      setEditingContact(null);
      setContactForm({ type: "email", label: "", value: "", order: 0 });
      toast.success("Contato atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar contato");
    }
  };

  const handleDeleteContact = async () => {
    if (!deletingContactId) return;
    try {
      await onDeleteContact(deletingContactId);
      setDeletingContactId(null);
      toast.success("Contato removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover contato");
    }
  };

  const startEditingLink = (link: FooterLink) => {
    setEditingLink(link);
    setLinkForm({
      label: link.label,
      url: link.url,
      order: link.order,
    });
  };

  const startEditingContact = (contact: FooterContact) => {
    setEditingContact(contact);
    setContactForm({
      type: contact.type,
      label: contact.label,
      value: contact.value,
      order: contact.order,
    });
  };

  const cancelEditingLink = () => {
    setEditingLink(null);
    setLinkForm({ label: "", url: "", order: 0 });
  };

  const cancelEditingContact = () => {
    setEditingContact(null);
    setContactForm({ type: "email", label: "", value: "", order: 0 });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Rodapé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Descrição */}
          <div>
            <Label htmlFor="description">Descrição do Rodapé</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setIsEditingDescription(true);
              }}
              placeholder="Digite a descrição que aparecerá no rodapé"
              rows={3}
              className="mt-2"
            />
            {isEditingDescription && (
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSaveDescription} size="sm">
                  Salvar Descrição
                </Button>
                <Button
                  onClick={() => {
                    setDescription(footerConfig?.description || "");
                    setIsEditingDescription(false);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          {/* Links Úteis */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>

            {/* Formulário de Link */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="linkLabel">Texto do Link</Label>
                  <Input
                    id="linkLabel"
                    value={linkForm.label}
                    onChange={(e) =>
                      setLinkForm({ ...linkForm, label: e.target.value })
                    }
                    placeholder="Ex: Portal da Transparência"
                  />
                </div>
                <div>
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    value={linkForm.url}
                    onChange={(e) =>
                      setLinkForm({ ...linkForm, url: e.target.value })
                    }
                    placeholder="Ex: https://exemplo.com"
                  />
                </div>
                <div className="flex gap-2">
                  {editingLink ? (
                    <>
                      <Button onClick={handleEditLink} size="sm">
                        Salvar Alterações
                      </Button>
                      <Button
                        onClick={cancelEditingLink}
                        variant="outline"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleAddLink} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Link
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de Links */}
            <div className="space-y-2">
              {sortedLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between bg-white border p-3 rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium">{link.label}</p>
                    <p className="text-sm text-gray-500">{link.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEditingLink(link)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setDeletingLinkId(link.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {sortedLinks.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum link cadastrado
                </p>
              )}
            </div>
          </div>

          {/* Contatos */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>

            {/* Formulário de Contato */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="contactType">Tipo de Contato</Label>
                  <Select
                    value={contactForm.type}
                    onValueChange={(value: ContactType) =>
                      setContactForm({ ...contactForm, type: value })
                    }
                  >
                    <SelectTrigger id="contactType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="location">Localização</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactValue">Valor</Label>
                  <Input
                    id="contactValue"
                    value={contactForm.value}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, value: e.target.value })
                    }
                    placeholder={
                      contactForm.type === "email"
                        ? "email@exemplo.com"
                        : contactForm.type === "phone" ||
                          contactForm.type === "whatsapp"
                        ? "(91) 99999-9999"
                        : contactForm.type === "location"
                        ? "Cidade - Estado"
                        : "https://exemplo.com"
                    }
                  />
                </div>
                <div className="flex gap-2">
                  {editingContact ? (
                    <>
                      <Button onClick={handleEditContact} size="sm">
                        Salvar Alterações
                      </Button>
                      <Button
                        onClick={cancelEditingContact}
                        variant="outline"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleAddContact} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Contato
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de Contatos */}
            <div className="space-y-2">
              {sortedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between bg-white border p-3 rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {contactTypeLabels[contact.type]}
                    </p>
                    <p className="text-sm text-gray-500">{contact.value}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEditingContact(contact)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setDeletingContactId(contact.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {sortedContacts.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum contato cadastrado
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmação para deletar link */}
      <AlertDialog
        open={!!deletingLinkId}
        onOpenChange={() => setDeletingLinkId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este link? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLink}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmação para deletar contato */}
      <AlertDialog
        open={!!deletingContactId}
        onOpenChange={() => setDeletingContactId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este contato? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContact}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
