import { useState } from "react";
import { Users, Shield } from "lucide-react";
import { Badge } from "./ui/badge";
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
      <div className="bg-[#0A1F44] p-4 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg">Gerenciar Usuários</h3>
            <p className="text-xs sm:text-sm text-white/80">
              Defina quem é administrador, publicador ou usuário
            </p>
          </div>
        </div>
        <Badge className="bg-white text-[#0A1F44] px-3 py-1 text-xs sm:text-sm">
          {users.length} {users.length === 1 ? "usuário" : "usuários"}
        </Badge>
      </div>

      <div className="p-4 sm:p-6">
        {users.length === 0 ? (
          <p className="text-sm text-[#333333]">
            Nenhum usuário cadastrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[540px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[#0A1F44]/60 border-b border-[#0A1F44]/10">
                  <th className="pb-3">Nome</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Nível de acesso</th>
                  <th className="pb-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#0A1F44]">
                {users.map((user) => {
                  const isCurrent = user.uid === currentUserId;
                  const isRootAdmin =
                    user.email.toLowerCase() === GOOGLE_ADMIN_EMAIL;

                  return (
                    <tr
                      key={user.uid}
                      className="border-b border-[#0A1F44]/10 last:border-0"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
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
                          disabled={pendingUserId === user.uid || isRootAdmin}
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
        )}
      </div>
    </div>
  );
}
