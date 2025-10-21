import { useState } from "react";
import { X, Mail, Shield, User as UserIcon, KeyRound } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { auth } from "../lib/firebase";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ensureUserDocument } from "../services/userService";
import type { UserRole } from "../types/user";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setMode("login");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleAuthSuccess = async (role: UserRole) => {
    onLogin(role);
    onClose();
    resetFields();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Informe email e senha.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const role = await ensureUserDocument(credentials.user);
      await handleAuthSuccess(role);
    } catch (error) {
      console.error("Erro de autenticação:", error);
      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          setErrorMessage("Credenciais inválidas ou usuário não autorizado.");
        } else {
          setErrorMessage(
            "Não foi possível concluir o login. Tente novamente."
          );
        }
      } else {
        setErrorMessage("Não foi possível concluir o login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage("Informe nome completo, email e senha.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(credentials.user, {
        displayName: fullName.trim(),
      });

      const role = await ensureUserDocument(credentials.user, {
        displayName: fullName.trim(),
        role: "user",
      });

      await handleAuthSuccess(role);
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("Este email já está em uso. Tente fazer login.");
        } else if (error.code === "auth/weak-password") {
          setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
        } else {
          setErrorMessage("Não foi possível criar a conta. Tente novamente.");
        }
      } else {
        setErrorMessage("Não foi possível criar a conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage("Informe o email cadastrado para recuperar a senha.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMessage(
        "Enviamos um email com o código de redefinição. Verifique sua caixa de entrada."
      );
    } catch (error) {
      console.error("Erro ao enviar recuperação de senha:", error);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/user-not-found") {
          setErrorMessage("Não encontramos uma conta com este email.");
        } else {
          setErrorMessage(
            "Não foi possível enviar o email de recuperação. Tente novamente."
          );
        }
      } else {
        setErrorMessage(
          "Não foi possível enviar o email de recuperação. Tente novamente."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credentials = await signInWithPopup(auth, provider);
      const role = await ensureUserDocument(credentials.user);
      await handleAuthSuccess(role);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      if (
        error instanceof FirebaseError &&
        (error.code === "auth/popup-closed-by-user" ||
          error.code === "auth/cancelled-popup-request")
      ) {
        return;
      }
      setErrorMessage("Não foi possível entrar com Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A1F44]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative overflow-hidden border border-[#C9A227]/20">
        {/* Barra superior decorativa */}
        <div className="h-2 bg-gradient-to-r from-[#0A1F44] via-[#C9A227] to-[#8B0000]"></div>

        <button
          onClick={() => {
            resetFields();
            onClose();
          }}
          className="absolute top-6 right-4 text-[#333333] hover:text-[#8B0000] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F44] to-[#0A1F44]/80 rounded-full"></div>
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-[#C9A227]" />
              </div>
            </div>
            <h2 className="text-[#0A1F44] mb-2">Acesso ao Sistema</h2>
            <p className="text-[#333333] text-sm">
              Controladoria Interna - CBMPA
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            <Button
              type="button"
              variant={mode === "login" ? "default" : "outline"}
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`text-sm px-4 ${
                mode === "login"
                  ? "bg-[#0A1F44] border-[#0A1F44] hover:bg-[#0A1F44]/90"
                  : "border-[#0A1F44]/30 text-[#0A1F44] hover:bg-[#F2F2F2]"
              }`}
            >
              Entrar
            </Button>
            <Button
              type="button"
              variant={mode === "register" ? "default" : "outline"}
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`text-sm px-4 ${
                mode === "register"
                  ? "bg-[#C9A227] border-[#C9A227] hover:bg-[#C9A227]/90"
                  : "border-[#0A1F44]/30 text-[#0A1F44] hover:bg-[#F2F2F2]"
              }`}
            >
              Criar Conta
            </Button>
          </div>

          {mode === "register" && (
            <div className="mb-6 rounded-lg border border-[#C9A227]/30 bg-[#C9A227]/10 p-4 text-sm text-[#0A1F44]">
              Crie sua conta institucional para acessar a plataforma. Após o
              cadastro, você poderá entrar com o email e a senha definidos.
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={mode === "login" ? handleLogin : handleRegister}
          >
            {mode === "register" && (
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-[#333333] flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-[#C9A227]" />
                  Nome Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ex: Maria Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-[#F2F2F2] hover:bg-white transition-colors"
                />
              </div>
            )}

            <div>
              <Label
                htmlFor="email"
                className="text-[#333333] flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#C9A227]" />
                Email Institucional
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@cbmpa.gov.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-[#F2F2F2] hover:bg-white transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#333333]">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 border-[#0A1F44]/20 focus:border-[#C9A227] focus:ring-[#C9A227] bg-[#F2F2F2] hover:bg-white transition-colors"
              />
              {mode === "login" && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-[#0A1F44] hover:text-[#8B0000] transition-colors"
                  disabled={isLoading}
                >
                  <KeyRound className="w-3 h-3" />
                  Esqueceu a senha?
                </button>
              )}
            </div>

            {errorMessage && (
              <p className="text-sm text-[#8B0000] bg-[#8B0000]/10 border border-[#8B0000]/20 rounded-md p-2">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="text-sm text-[#0A1F44] bg-[#0A1F44]/10 border border-[#0A1F44]/20 rounded-md p-2">
                {successMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white shadow-md hover:shadow-lg transition-all border-2 border-[#C9A227]"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isLoading
                ? mode === "login"
                  ? "Entrando..."
                  : "Criando conta..."
                : mode === "login"
                ? "Entrar no Sistema"
                : "Criar Conta"}
            </Button>

            {mode === "login" && (
              <>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#C9A227]/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-[#333333]">ou</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  variant="outline"
                  disabled={isLoading}
                  className="w-full border-[#0A1F44]/20 hover:bg-[#F2F2F2] hover:border-[#C9A227] text-[#333333] transition-all"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isLoading ? "Conectando..." : "Continuar com Google"}
                </Button>
              </>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-[#C9A227]/20 space-y-2">
            <p className="text-center text-xs text-[#333333]/70">
              <Shield className="w-3 h-3 inline mr-1 text-[#C9A227]" />O nível
              de acesso é definido automaticamente pelo sistema.
            </p>
            <p className="text-center text-xs text-[#333333]/60">
              Sistema de uso interno do CBMPA
              <br />
              <span className="text-[#C9A227]">
                Corpo de Bombeiros Militar do Pará
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
