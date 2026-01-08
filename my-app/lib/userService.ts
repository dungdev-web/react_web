import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getUserRole(uid: string): Promise<string | null> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return (data.role as string) || "user";
    } else {
      return "user";
    }
  } catch (error) {
    console.error("Lỗi lấy role:", error);
    return null;
  }
}
