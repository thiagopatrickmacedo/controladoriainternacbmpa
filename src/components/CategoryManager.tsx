import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Category, CategoryInput } from "../types/content";
import { toast } from "sonner";
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

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: CategoryInput) => Promise<void> | void;
  onEditCategory: (id: string, category: CategoryInput) => Promise<void> | void;
  onDeleteCategory: (id: string) => Promise<void> | void;
}

export function CategoryManager({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    color: "#0A1F44",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.label || !formData.color) {
      toast.error("Preencha todos os campos!");
      return;
    }

    const categoryData: CategoryInput = {
      name: formData.name.toLowerCase().replace(/\s+/g, "-"),
      label: formData.label,
      color: formData.color,
    };

    try {
      if (editingId) {
        await onEditCategory(editingId, categoryData);
        toast.success("Categoria atualizada com sucesso!");
        setEditingId(null);
      } else {
        await onAddCategory(categoryData);
        toast.success("Categoria adicionada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Não foi possível salvar a categoria.");
      return;
    }

    setFormData({
      name: "",
      label: "",
      color: "#0A1F44",
    });
    setIsFormOpen(false);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      label: category.label,
      color: category.color,
    });
    setEditingId(category.id);
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsFormOpen(false);
    setFormData({
      name: "",
      label: "",
      color: "#0A1F44",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteCategory(id);
      toast.success("Categoria excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Não foi possível excluir a categoria.");
    } finally {
      setDeleteCategoryId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-[#C9A227]/20">
      <div className="bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C9A227] flex items-center justify-center">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-white mb-1">Gerenciar Categorias</h3>
              <p className="text-white/80 text-sm">
                Criar e editar categorias de vídeos
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              if (isFormOpen && !editingId) {
                setIsFormOpen(false);
              } else if (isFormOpen && editingId) {
                handleCancelEdit();
              } else {
                setIsFormOpen(true);
              }
            }}
            className={`${
              isFormOpen
                ? "bg-[#8B0000] hover:bg-[#8B0000]/90"
                : "bg-[#C9A227] hover:bg-[#C9A227]/90"
            } text-white shadow-lg transition-all`}
          >
            {isFormOpen ? (
              <>
                <X className="w-5 h-5 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Nova Categoria
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-6">
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 mb-8 p-6 bg-[#F2F2F2]/50 rounded-lg border-2 border-[#C9A227]/30"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="label" className="text-[#0A1F44]">
                  Nome da Categoria <span className="text-[#8B0000]">*</span>
                </Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      label: e.target.value,
                      name: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    }))
                  }
                  placeholder="Ex: Auditoria"
                  className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-white"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="color"
                  className="text-[#0A1F44] flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  Cor da Categoria <span className="text-[#8B0000]">*</span>
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="w-16 h-10 p-1 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-white cursor-pointer"
                    required
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    placeholder="#0A1F44"
                    className="flex-1 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-white"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="text-[#0A1F44]">Pré-visualização</Label>
                <div className="mt-2 p-4 bg-white rounded-lg border border-[#C9A227]/20 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: formData.color }}
                  ></div>
                  <span className="text-[#333333]">
                    {formData.label || "Nome da categoria"}
                  </span>
                </div>
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
                {editingId ? "Salvar Alterações" : "Criar Categoria"}
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          <h4 className="text-[#0A1F44]">
            Categorias Existentes ({categories.length})
          </h4>

          {categories.length === 0 ? (
            <div className="text-center py-16 bg-[#F2F2F2]/50 rounded-lg">
              <Palette className="w-12 h-12 text-[#C9A227] mx-auto mb-4 opacity-50" />
              <p className="text-[#333333]">Nenhuma categoria criada</p>
              <p className="text-[#333333]/60 text-sm mt-2">
                Clique em "Nova Categoria" para criar a primeira
              </p>
            </div>
          ) : (
            <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-[#C9A227]/20 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div>
                        <h5 className="text-[#0A1F44]">{category.label}</h5>
                        <p className="text-sm text-[#333333]/60">
                          {category.color}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                        className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteCategoryId(category.id)}
                        className="border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={!!deleteCategoryId}
        onOpenChange={() => setDeleteCategoryId(null)}
      >
        <AlertDialogContent className="bg-white border-2 border-[#8B0000]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#8B0000] flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#333333]">
              Tem certeza que deseja excluir esta categoria? Vídeos associados a
              ela ficarão sem categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#333333] text-[#333333] hover:bg-[#F2F2F2]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCategoryId && handleDelete(deleteCategoryId)}
              className="bg-[#8B0000] hover:bg-[#8B0000]/90 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
