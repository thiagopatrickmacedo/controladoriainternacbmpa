import { useState, useMemo } from "react";
import { Users, Shield, Search } from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import type { UserProfile, UserRole } from "../types/user";
import { GOOGLE_ADMIN_EMAIL } from "../services/userService";

interface UserManagerProps {
  users: UserProfile[];
  currentUserId?: string;
  onChangeRole: (user: UserProfile, role: UserRole) => Promise<void> | void;
}

const ROLE_OPTIONS: Array<{
  value: UserRole;
  label: string;
  description: string;
}> = [
  {
    value: "admin",
    label: "Administrador",
    description: "Gerencia vídeos, categorias e usuários",
  },
  {
    value: "publisher",
    label: "Publicador",
    description: "Gerencia vídeos, categorias e destaques",
  },
  {
    value: "user",
    label: "Usuário",
    description: "Apenas visualiza os vídeos",
  },
];

export function UserManager({
  users,
  currentUserId,
  onChangeRole,
}: UserManagerProps) {
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar usuários baseado na pesquisa
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase().trim();
    return users.filter((user) => {
      const name = (user.displayName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }, [users, searchTerm]);

  const handleRoleSelection = async (user: UserProfile, role: UserRole) => {
    if (user.role === role || pendingUserId) {
      return;
    }

    if (user.email.toLowerCase() === GOOGLE_ADMIN_EMAIL && role !== "admin") {
      // Protegemos o administrador principal no nível de interface.
      return;
    }

    try {
      setPendingUserId(user.uid);
      await onChangeRole(user, role);
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-[#0A1F44]/10">
      <div className="bg-[#0A1F44] p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-[#C9A227] flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold">
                Gerenciar Usuários
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                Defina quem é administrador, publicador ou usuário
              </p>
            </div>
          </div>
          <Badge className="bg-white text-[#0A1F44] px-3 py-1 text-xs sm:text-sm font-medium self-start sm:self-auto whitespace-nowrap">
            {users.length} {users.length === 1 ? "usuário" : "usuários"}
          </Badge>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Campo de Pesquisa */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#0A1F44]/40" />
            <Input
              type="text"
              placeholder="Pesquisar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] text-sm"
            />
          </div>
          {searchTerm && (
            <p className="text-xs text-[#0A1F44]/60 mt-2">
              {filteredUsers.length === 0
                ? "Nenhum usuário encontrado"
                : `${filteredUsers.length} ${
                    filteredUsers.length === 1
                      ? "usuário encontrado"
                      : "usuários encontrados"
                  }`}
            </p>
          )}
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-[#333333]">
            Nenhum usuário cadastrado ainda.
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-sm text-[#0A1F44]/60 text-center py-8">
            Nenhum usuário encontrado com "{searchTerm}"
          </p>
        ) : (
          <>
            {/* Layout Desktop - Tabela com Scroll */}
            <div className="hidden md:block">
              <div className="max-h-[500px] overflow-y-auto overflow-x-auto pr-2">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="text-left text-xs uppercase tracking-wide text-[#0A1F44]/60 border-b border-[#0A1F44]/10">
                      <th className="pb-3 bg-white">Nome</th>
                      <th className="pb-3 bg-white">Email</th>
                      <th className="pb-3 bg-white">Nível de acesso</th>
                      <th className="pb-3 text-right bg-white">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#0A1F44]">
                    {filteredUsers.map((user) => {
                      const isCurrent = user.uid === currentUserId;
                      const isRootAdmin =
                        user.email.toLowerCase() === GOOGLE_ADMIN_EMAIL;

                      return (
                        <tr
                          key={user.uid}
                          className="border-b border-[#0A1F44]/10 last:border-0"
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">
                                {user.displayName || "Usuário"}
                              </span>
                              {isCurrent && (
                                <Badge
                                  variant="outline"
                                  className="border-[#C9A227] text-[#C9A227] text-[10px] uppercase"
                                >
                                  Você
                                </Badge>
                              )}
                              {isRootAdmin && (
                                <Badge className="bg-[#8B0000] text-white text-[10px] uppercase">
                                  Principal
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-[#0A1F44]/80">
                            {user.email || "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-[#C9A227]" />
                              <span className="capitalize">
                                {ROLE_OPTIONS.find(
                                  (option) => option.value === user.role
                                )?.label ?? "Usuário"}
                              </span>
                            </div>
                            <p className="text-xs text-[#0A1F44]/60 ml-6">
                              {
                                ROLE_OPTIONS.find(
                                  (option) => option.value === user.role
                                )?.description
                              }
                            </p>
                          </td>
                          <td className="py-3 text-right">
                            <Select
                              value={user.role}
                              onValueChange={(value: string) =>
                                handleRoleSelection(user, value as UserRole)
                              }
                              disabled={
                                pendingUserId === user.uid || isRootAdmin
                              }
                            >
                              <SelectTrigger className="w-[170px] border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLE_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    <div className="flex flex-col">
                                      <span>{option.label}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {option.description}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Layout Mobile - Cards com Scroll */}
            <div className="md:hidden max-h-[500px] overflow-y-auto pr-2">
              <div className="space-y-4">
                {filteredUsers.map((user) => {
                  const isCurrent = user.uid === currentUserId;
                  const isRootAdmin =
                    user.email.toLowerCase() === GOOGLE_ADMIN_EMAIL;

                  return (
                    <div
                      key={user.uid}
                      className="border border-[#0A1F44]/10 rounded-lg p-5 space-y-4 bg-white shadow-sm"
                    >
                      {/* Nome e Badges - Centralizados */}
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold text-[#0A1F44] text-base">
                          {user.displayName || "Usuário"}
                        </h4>
                        <div className="flex gap-2 justify-center flex-wrap">
                          {isCurrent && (
                            <Badge
                              variant="outline"
                              className="border-[#C9A227] text-[#C9A227] text-[10px] uppercase font-medium"
                            >
                              Você
                            </Badge>
                          )}
                          {isRootAdmin && (
                            <Badge className="bg-[#8B0000] text-white text-[10px] uppercase font-medium">
                              Principal
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Email - Centralizado */}
                      <div className="text-center">
                        <p className="text-xs text-[#0A1F44]/60 uppercase tracking-wide mb-1">
                          Email
                        </p>
                        <p className="text-sm text-[#0A1F44]/80 break-all">
                          {user.email || "—"}
                        </p>
                      </div>

                      {/* Nível de Acesso - Centralizado com fundo */}
                      <div className="bg-[#0A1F44]/5 rounded-lg p-4 text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Shield className="w-5 h-5 text-[#C9A227]" />
                          <span className="text-base font-semibold text-[#0A1F44] capitalize">
                            {ROLE_OPTIONS.find(
                              (option) => option.value === user.role
                            )?.label ?? "Usuário"}
                          </span>
                        </div>
                        <p className="text-xs text-[#0A1F44]/70 leading-relaxed">
                          {
                            ROLE_OPTIONS.find(
                              (option) => option.value === user.role
                            )?.description
                          }
                        </p>
                      </div>

                      {/* Ações - Centralizado */}
                      <div className="pt-2 space-y-3">
                        <label className="text-xs text-[#0A1F44]/60 uppercase tracking-wide block text-center font-medium">
                          Alterar nível de acesso
                        </label>
                        <div className="flex justify-center">
                          <Select
                            value={user.role}
                            onValueChange={(value: string) =>
                              handleRoleSelection(user, value as UserRole)
                            }
                            disabled={pendingUserId === user.uid || isRootAdmin}
                          >
                            <SelectTrigger className="w-full max-w-xs border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] h-11 text-center justify-center">
                              <SelectValue className="text-center" />
                            </SelectTrigger>
                            <SelectContent align="center">
                              {ROLE_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  <div className="flex flex-col py-1 text-center">
                                    <span className="font-medium">
                                      {option.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-0.5">
                                      {option.description}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
