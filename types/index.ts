import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  role: "client" | "admin";
  createdAt: Timestamp;
}

export interface DemoRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  whatsappNumber: string;
  businessType: string;
  requirement: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: Timestamp;
}

export interface Demo {
  id: string;
  userId: string;
  demoUrl: string;
  title: string;
  status: "in_progress" | "ready" | "updated";
  notes: string;
  createdAt: Timestamp;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  imageUrls: string[];
  liveUrl: string;
  createdAt: Timestamp;
}

export interface AdminSettings {
  defaultTheme: "light" | "dark";
  homepageHeadline: string;
  homepageSubtext: string;
  profileImageUrl: string;
  profileImageSize: "small" | "medium" | "large";
  profileImageShape: "circle" | "rounded" | "square";
  heroBgImageUrl: string;
  heroBgOpacity: number;
  heroBgColor: string;
}

export interface HeroSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  profileImageUrl: string;
  imageLayout: "left" | "center" | "right" | "hidden";
  imageShape: "none" | "circle" | "square" | "rounded";
  imageSize: "small" | "medium" | "large";
  imageOpacity: number;
  imageVisible: boolean;
  backgroundType: "color" | "gradient" | "image";
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundImageUrl: string;
  updatedAt?: Timestamp;
}

export interface PopupSettings {
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  updatedAt?: Timestamp;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  updatedAt?: Timestamp;
}
