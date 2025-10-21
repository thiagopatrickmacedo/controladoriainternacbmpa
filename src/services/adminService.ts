import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return false;
  }

  try {
    const adminDoc = await getDoc(doc(db, "admins", normalizedEmail));
    return adminDoc.exists();
  } catch (error) {
    console.error("Falha ao verificar admin:", error);
    return false;
  }
}
