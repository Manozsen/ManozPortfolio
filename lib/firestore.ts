import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { User, DemoRequest, Demo, Project, AdminSettings } from "@/types";

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function createOrUpdateUser(
  uid: string,
  data: Partial<User>
): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      ...data,
      role:
        data.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? "admin" : "client",
      createdAt: serverTimestamp(),
    });
  }
}

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as User;
}

export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as User));
}

// ─── DEMO REQUESTS ────────────────────────────────────────────────────────────

export async function createDemoRequest(
  data: Omit<DemoRequest, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "demoRequests"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllDemoRequests(): Promise<DemoRequest[]> {
  const q = query(
    collection(db, "demoRequests"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DemoRequest));
}

export async function updateDemoRequestStatus(
  id: string,
  status: DemoRequest["status"]
): Promise<void> {
  await updateDoc(doc(db, "demoRequests", id), { status });
}

// ─── DEMOS ────────────────────────────────────────────────────────────────────

export async function createDemo(
  data: Omit<Demo, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "demos"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getDemosByUser(userId: string): Promise<Demo[]> {
  const q = query(
    collection(db, "demos"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Demo));
}

export async function getAllDemos(): Promise<Demo[]> {
  const q = query(collection(db, "demos"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Demo));
}

export async function updateDemo(
  id: string,
  data: Partial<Demo>
): Promise<void> {
  await updateDoc(doc(db, "demos", id), data);
}

export async function deleteDemo(id: string): Promise<void> {
  await deleteDoc(doc(db, "demos", id));
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

export async function createProject(
  data: Omit<Project, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Project;
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<void> {
  await updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// ─── ADMIN SETTINGS ───────────────────────────────────────────────────────────

export async function getAdminSettings(): Promise<AdminSettings> {
  const snap = await getDoc(doc(db, "adminSettings", "main"));
  if (!snap.exists()) {
    return {
      defaultTheme: "light",
      homepageHeadline:
        "I build high-converting websites for creators, local businesses, and Instagram-based sellers",
      homepageSubtext:
        "Turn your audience into customers with a website built for trust and conversions",
      profileImageUrl: "",
      profileImageSize: "medium",
      profileImageShape: "rounded",
      heroBgImageUrl: "",
      heroBgOpacity: 10,
      heroBgColor: "#f8f7ff",
    };
  }
  return snap.data() as AdminSettings;
}

export async function updateAdminSettings(
  data: Partial<AdminSettings>
): Promise<void> {
  await setDoc(doc(db, "adminSettings", "main"), data, { merge: true });
}
