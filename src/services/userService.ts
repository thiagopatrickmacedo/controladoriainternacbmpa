import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../lib/firebase";
import type { UserProfile, UserRole } from "../types/user";

export const GOOGLE_ADMIN_EMAIL = "cpci193.app@gmail.com";

function mapUserDocument(
  docSnapshot: QueryDocumentSnapshot<DocumentData>
): UserProfile {
  const data = docSnapshot.data();

  return {
    uid: docSnapshot.id,
    displayName: data.displayName ?? "Usuário",
    email: data.email ?? "",
    role: (data.role ?? "user") as UserRole,
    provider: data.provider ?? "password",
    createdAt: data.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000).toISOString()
      : undefined,
    updatedAt: data.updatedAt?.seconds
      ? new Date(data.updatedAt.seconds * 1000).toISOString()
      : undefined,
  };
}

function mapSingleUserDocument(
  docSnapshot: DocumentSnapshot<DocumentData>
): UserProfile | null {
  if (!docSnapshot.exists()) {
    return null;
  }

  const data = docSnapshot.data();
  return {
    uid: docSnapshot.id,
    displayName: data?.displayName ?? "Usuário",
    email: data?.email ?? "",
    role: (data?.role ?? "user") as UserRole,
    provider: data?.provider ?? "password",
    createdAt: data?.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000).toISOString()
      : undefined,
    updatedAt: data?.updatedAt?.seconds
      ? new Date(data.updatedAt.seconds * 1000).toISOString()
      : undefined,
  };
}

function resolveRoleForUser(
  email: string | null | undefined,
  existingRole?: UserRole
): UserRole {
  const normalizedEmail = (email ?? "").trim().toLowerCase();
  if (normalizedEmail === GOOGLE_ADMIN_EMAIL) {
    return "admin";
  }
  return existingRole ?? "user";
}

export async function ensureUserDocument(
  user: User,
  options?: { displayName?: string; role?: UserRole }
): Promise<UserRole> {
  const userDocRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userDocRef);
  const existing = mapSingleUserDocument(snapshot);

  const role = resolveRoleForUser(user.email, options?.role ?? existing?.role);

  const displayName =
    options?.displayName ||
    user.displayName ||
    existing?.displayName ||
    user.email?.split("@")[0] ||
    "Usuário";

  const payload = {
    displayName,
    email: user.email ?? existing?.email ?? "",
    role,
    provider:
      user.providerData[0]?.providerId ?? existing?.provider ?? "password",
    updatedAt: serverTimestamp(),
  };

  if (snapshot.exists()) {
    await setDoc(userDocRef, payload, { merge: true });
  } else {
    await setDoc(userDocRef, { ...payload, createdAt: serverTimestamp() });
  }

  return role;
}

export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void
): Unsubscribe {
  const userDocRef = doc(db, "users", uid);
  return onSnapshot(userDocRef, (snapshot) => {
    callback(mapSingleUserDocument(snapshot));
  });
}

export function subscribeToUsers(
  callback: (users: UserProfile[]) => void
): Unsubscribe {
  const usersQuery = query(collection(db, "users"), orderBy("displayName"));
  return onSnapshot(usersQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    callback(snapshot.docs.map(mapUserDocument));
  });
}

export async function updateUserRole(
  uid: string,
  role: UserRole
): Promise<void> {
  const userDocRef = doc(db, "users", uid);
  const snapshot = await getDoc(userDocRef);
  if (!snapshot.exists()) {
    throw new Error("Usuário não encontrado");
  }

  await setDoc(
    userDocRef,
    {
      role,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return mapSingleUserDocument(snapshot);
}
