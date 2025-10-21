import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturedSlider } from "./components/FeaturedSlider";
import { VideoGallery } from "./components/VideoGallery";
import { Footer } from "./components/Footer";
import { LoginModal } from "./components/LoginModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { CategoryManager } from "./components/CategoryManager";
import { UserManager } from "./components/UserManager";
import { FooterManager } from "./components/FooterManager";
import { Toaster } from "./components/ui/sonner";
import { getYouTubeThumbnail, normalizeVideoUrl } from "./utils/videoHelpers";
import type {
  Category,
  CategoryInput,
  Video,
  VideoInput,
  FooterConfig,
  FooterLink,
  FooterContact,
} from "./types/content";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
} from "firebase/firestore";
import { toast } from "sonner";
import type { UserProfile, UserRole } from "./types/user";
import {
  ensureUserDocument,
  subscribeToUserProfile,
  subscribeToUsers,
  updateUserRole,
  GOOGLE_ADMIN_EMAIL,
} from "./services/userService";

function mapVideoDocument(
  docSnapshot: QueryDocumentSnapshot<DocumentData>
): Video {
  const data = docSnapshot.data();
  const normalizedUrl = normalizeVideoUrl(data.videoUrl ?? "");

  return {
    id: docSnapshot.id,
    title: data.title ?? "",
    description: data.description ?? "",
    category: data.category ?? "",
    duration: data.duration ?? "",
    thumbnail: data.thumbnail || getYouTubeThumbnail(normalizedUrl),
    videoUrl: normalizedUrl,
    publishDate: data.publishDate ?? "",
    featured: data.featured ?? false,
    createdAt: data.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000).toISOString()
      : undefined,
  };
}

function mapCategoryDocument(
  docSnapshot: QueryDocumentSnapshot<DocumentData>
): Category {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    name: data.name ?? "",
    label: data.label ?? "",
    color: data.color ?? "#0A1F44",
  };
}

export default function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    signOut(auth).catch((error: unknown) => {
      console.error("Erro ao sair:", error);
      toast.error("Não foi possível encerrar a sessão. Tente novamente.");
    });
    setIsLoggedIn(false);
    setUserRole(undefined);
    setUserProfile(null);
    setUsers([]);
  };

  const handleAddVideo = async (newVideo: VideoInput) => {
    try {
      const normalizedUrl = normalizeVideoUrl(newVideo.videoUrl);

      await addDoc(collection(db, "videos"), {
        ...newVideo,
        videoUrl: normalizedUrl,
        thumbnail: newVideo.thumbnail || getYouTubeThumbnail(normalizedUrl),
        publishDate:
          newVideo.publishDate || new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao adicionar vídeo:", error);
      toast.error("Não foi possível adicionar o vídeo. Tente novamente.");
    }
  };

  const handleEditVideo = async (id: string, updatedVideo: VideoInput) => {
    try {
      const normalizedUrl = normalizeVideoUrl(updatedVideo.videoUrl);

      await updateDoc(doc(db, "videos", id), {
        ...updatedVideo,
        videoUrl: normalizedUrl,
        thumbnail: updatedVideo.thumbnail || getYouTubeThumbnail(normalizedUrl),
      });
    } catch (error) {
      console.error("Erro ao atualizar vídeo:", error);
      toast.error("Não foi possível atualizar o vídeo.");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "videos", id));
    } catch (error) {
      console.error("Erro ao excluir vídeo:", error);
      toast.error("Não foi possível excluir o vídeo.");
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await updateDoc(doc(db, "videos", id), { featured });
    } catch (error) {
      console.error("Erro ao alternar destaque:", error);
      toast.error("Não foi possível atualizar o destaque.");
    }
  };

  const handleAddCategory = async (newCategory: CategoryInput) => {
    try {
      await addDoc(collection(db, "categories"), newCategory);
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      toast.error("Não foi possível adicionar a categoria.");
    }
  };

  const handleEditCategory = async (
    id: string,
    updatedCategory: CategoryInput
  ) => {
    try {
      await updateDoc(doc(db, "categories", id), updatedCategory);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Não foi possível atualizar a categoria.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Não foi possível excluir a categoria.");
    }
  };

  // Footer handlers
  const handleUpdateFooterDescription = async (description: string) => {
    try {
      const footerDocRef = doc(db, "footerConfig", "default");
      await setDoc(footerDocRef, { description }, { merge: true });
      toast.success("Descrição atualizada!");
    } catch (error) {
      console.error("Erro ao atualizar descrição:", error);
      toast.error("Erro ao atualizar descrição.");
    }
  };

  const handleAddFooterLink = async (link: Omit<FooterLink, "id">) => {
    try {
      const footerDocRef = doc(db, "footerConfig", "default");
      const footerDoc = await getDoc(footerDocRef);
      const currentLinks = footerDoc.exists() ? footerDoc.data()?.links || [] : [];
      const newLink = { ...link, id: Date.now().toString() };
      await setDoc(
        footerDocRef,
        {
          links: [...currentLinks, newLink],
        },
        { merge: true }
      );
      toast.success("Link adicionado!");
    } catch (error) {
      console.error("Erro ao adicionar link:", error);
      toast.error("Erro ao adicionar link.");
    }
  };

  const handleEditFooterLink = async (
    id: string,
    link: Omit<FooterLink, "id">
  ) => {
    try {
      const footerDocRef = doc(db, "footerConfig", "default");
      const footerDoc = await getDoc(footerDocRef);
      const currentLinks = footerDoc.exists() ? footerDoc.data()?.links || [] : [];
      const updatedLinks = currentLinks.map((l: FooterLink) =>
        l.id === id ? { ...link, id } : l
      );
      await setDoc(footerDocRef, { links: updatedLinks }, { merge: true });
      toast.success("Link atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar link:", error);
      toast.error("Erro ao atualizar link.");
    }
  };

  const handleDeleteFooterLink = async (id: string) => {
    try {
      const footerDocRef = doc(db, "footerConfig", "default");
      const footerDoc = await getDoc(footerDocRef);
      const currentLinks = footerDoc.exists() ? footerDoc.data()?.links || [] : [];
      const updatedLinks = currentLinks.filter((l: FooterLink) => l.id !== id);
      await setDoc(footerDocRef, { links: updatedLinks }, { merge: true });
      toast.success("Link removido!");
    } catch (error) {
      console.error("Erro ao remover link:", error);
      toast.error("Erro ao remover link.");
    }
  };

  const handleAddFooterContact = async (
    contact: Omit<FooterContact, "id">
  ) => {
    try {
      const footerDocRef = doc(db, "footerConfig", "default");
      const footerDoc = await getDoc(footerDocRef);
      const currentContacts = footerDoc.exists() ? footerDoc.data()?.contacts || [] : [];
      const newContact = { ...contact, id: Date.now().toString() };
      await setDoc(
        footerDocRef,
        {
          contacts: [...currentContacts, newContact],
        },
        { merge: true }
      );
      toast.success("Contato adicionado!");
    } catch (error) {
      console.error("Erro ao adicionar contato:", error);
      toast.error("Erro ao adicionar contato.");
    }
  };

  const handleEditFooterContact = async (
    id: string,
    contact: Omit<FooterContact, "id">
  ) => {
    try {
      const footerDocRef = doc(db, "footerConfig", "default");
      const footerDoc = await getDoc(footerDocRef);
      const currentContacts = footerDoc.exists() ? footerDoc.data()?.contacts || [] : [];
      const updatedContacts = currentContacts.map((c: FooterContact) =>
        c.id === id ? { ...contact, id } : c
      );
      await setDoc(footerDocRef, { contacts: updatedContacts }, { merge: true });
      toast.success("Contato atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar contato:", error);
      toast.error("Erro ao atualizar contato.");
    }
  };

  const handleDeleteFooterContact = async (id: string) => {
    try {
      const footerDocRef = doc(db, "footerConfig", "default");
      const footerDoc = await getDoc(footerDocRef);
      const currentContacts = footerDoc.exists() ? footerDoc.data()?.contacts || [] : [];
      const updatedContacts = currentContacts.filter(
        (c: FooterContact) => c.id !== id
      );
      await setDoc(footerDocRef, { contacts: updatedContacts }, { merge: true });
      toast.success("Contato removido!");
    } catch (error) {
      console.error("Erro ao remover contato:", error);
      toast.error("Erro ao remover contato.");
    }
  };

  const handleChangeUserRole = async (
    targetUser: UserProfile,
    role: UserRole
  ) => {
    if (targetUser.role === role) {
      return;
    }

    if (targetUser.email.toLowerCase() === GOOGLE_ADMIN_EMAIL) {
      if (role !== "admin") {
        toast.error("O administrador principal não pode ter o nível alterado.");
        return;
      }
      return;
    }

    try {
      await updateUserRole(targetUser.uid, role);
      const roleLabel =
        role === "admin"
          ? "Administrador"
          : role === "publisher"
          ? "Publicador"
          : "Usuário";
      toast.success(`Nível atualizado para ${roleLabel}.`);
    } catch (error) {
      console.error("Erro ao atualizar nível do usuário:", error);
      toast.error("Não foi possível atualizar o nível do usuário.");
    }
  };

  useEffect(() => {
    const videosQuery = query(
      collection(db, "videos"),
      orderBy("publishDate", "desc")
    );

    const unsubscribeVideos = onSnapshot(
      videosQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        setVideos(snapshot.docs.map(mapVideoDocument));
      }
    );

    const unsubscribeCategories = onSnapshot(
      collection(db, "categories"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        setCategories(snapshot.docs.map(mapCategoryDocument));
      }
    );

    const unsubscribeFooter = onSnapshot(
      doc(db, "footerConfig", "default"),
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setFooterConfig({
            id: snapshot.id,
            description: data.description || "",
            links: data.links || [],
            contacts: data.contacts || [],
          });
        } else {
          // Criar documento padrão se não existir
          await setDoc(doc(db, "footerConfig", "default"), {
            description:
              "Promovendo a transparência e o controle efetivo dos recursos públicos do Corpo de Bombeiros Militar do Pará.",
            links: [],
            contacts: [],
          });
        }
      }
    );

    return () => {
      unsubscribeVideos();
      unsubscribeCategories();
      unsubscribeFooter();
    };
  }, []);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;
    let usersUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        profileUnsubscribe?.();
        profileUnsubscribe = null;

        if (usersUnsubscribe) {
          usersUnsubscribe();
          usersUnsubscribe = null;
        }

        if (firebaseUser) {
          setIsLoggedIn(true);

          let fallbackRole: UserRole = "user";
          try {
            fallbackRole = await ensureUserDocument(firebaseUser);
          } catch (error) {
            console.error("Erro ao garantir documento do usuário:", error);
          }

          profileUnsubscribe = subscribeToUserProfile(
            firebaseUser.uid,
            (profile) => {
              setUserProfile(profile);
              const resolvedRole = profile?.role ?? fallbackRole ?? "user";
              setUserRole(resolvedRole);

              if (resolvedRole === "admin") {
                if (!usersUnsubscribe) {
                  usersUnsubscribe = subscribeToUsers((list) => {
                    setUsers(list);
                  });
                }
              } else {
                setUsers([]);
                if (usersUnsubscribe) {
                  usersUnsubscribe();
                  usersUnsubscribe = null;
                }
              }
            }
          );
        } else {
          setIsLoggedIn(false);
          setUserRole(undefined);
          setUserProfile(null);
          setUsers([]);
        }
      }
    );

    return () => {
      unsubscribe();
      profileUnsubscribe?.();
      if (usersUnsubscribe) {
        usersUnsubscribe();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden w-full">
      <Header
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userName={userProfile?.displayName}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />
      <Hero />
      <FeaturedSlider videos={videos} categories={categories} />

      {isLoggedIn && (userRole === "admin" || userRole === "publisher") && (
        <div className="bg-[#F2F2F2] py-8">
          <div className="container mx-auto px-4 space-y-6">
            <AdminDashboard
              videos={videos}
              categories={categories}
              onAddVideo={handleAddVideo}
              onEditVideo={handleEditVideo}
              onDeleteVideo={handleDeleteVideo}
              onToggleFeatured={handleToggleFeatured}
              userRole={userRole}
            />
            <CategoryManager
              categories={categories}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
            {userRole === "admin" && (
              <>
                <UserManager
                  users={users}
                  currentUserId={userProfile?.uid}
                  onChangeRole={handleChangeUserRole}
                />
                <FooterManager
                  footerConfig={footerConfig}
                  onUpdateDescription={handleUpdateFooterDescription}
                  onAddLink={handleAddFooterLink}
                  onEditLink={handleEditFooterLink}
                  onDeleteLink={handleDeleteFooterLink}
                  onAddContact={handleAddFooterContact}
                  onEditContact={handleEditFooterContact}
                  onDeleteContact={handleDeleteFooterContact}
                />
              </>
            )}
          </div>
        </div>
      )}

      <VideoGallery videos={videos} categories={categories} />
      <Footer footerConfig={footerConfig} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <Toaster />
    </div>
  );
}
