import { Shield, LogIn, LogOut, UserCog, Film } from "lucide-react";
import { Button } from "./ui/button";
import type { UserRole } from "../types/user";

interface HeaderProps {
  isLoggedIn: boolean;
  userRole?: UserRole;
  userName?: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function Header({
  isLoggedIn,
  userRole,
  userName,
  onLoginClick,
  onLogoutClick,
}: HeaderProps) {
  const roleLabel =
    userRole === "admin"
      ? "Admin"
      : userRole === "publisher"
      ? "Publicador"
      : undefined;

  return (
    <header className="bg-[#0A1F44] text-white shadow-lg sticky top-0 z-50 w-full overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#C9A227] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-white text-sm sm:text-base leading-tight truncate">
                Controladoria Interna
              </h1>
              <p className="text-white/80 text-xs sm:text-sm leading-tight truncate">
                CBMPA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-end flex-shrink-0">
            <nav className="hidden md:flex gap-6 flex-shrink-0">
              <a
                href="#videos"
                className="text-white/90 hover:text-[#C9A227] transition-colors"
              >
                Vídeos
              </a>
              <a
                href="#sobre"
                className="text-white/90 hover:text-[#C9A227] transition-colors"
              >
                Sobre
              </a>
              <a
                href="#contato"
                className="text-white/90 hover:text-[#C9A227] transition-colors"
              >
                Contato
              </a>
            </nav>
            {isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {roleLabel && (
                  <div
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
                      userRole === "admin"
                        ? "bg-[#8B0000]"
                        : "bg-[#C9A227] text-[#0A1F44]"
                    }`}
                  >
                    {userRole === "admin" ? (
                      <UserCog className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    ) : (
                      <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    )}
                    <span className="whitespace-nowrap text-[11px] sm:text-sm">
                      {roleLabel}
                    </span>
                  </div>
                )}
                {userName && (
                  <span className="hidden md:inline text-xs sm:text-sm text-white/80 max-w-[140px] truncate">
                    {userName}
                  </span>
                )}
                <Button
                  onClick={onLogoutClick}
                  variant="outline"
                  className="bg-transparent border-white/30 hover:bg-white/10 hover:border-white/50 text-white text-xs sm:text-sm px-3 sm:px-4 h-9 sm:h-10 flex-shrink-0 font-medium transition-all"
                  size="sm"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="whitespace-nowrap">Sair</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={onLoginClick}
                className="bg-[#C9A227] hover:bg-[#A08420] text-white text-xs sm:text-sm px-4 sm:px-5 h-9 sm:h-10 flex-shrink-0 font-medium shadow-md hover:shadow-lg transition-all"
                size="sm"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="whitespace-nowrap">Entrar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
