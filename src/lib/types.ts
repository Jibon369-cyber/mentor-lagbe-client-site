export type Role = "student" | "tutor" | "admin";

export type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
  plan: "free" | "pro";
  phone?: string;
  bio?: string;
  savedTuitions?: string[];
  createdAt: string;
};

export type Review = {
  _id?: string;
  studentName: string;
  tuitionTitle?: string;
  subject?: string;
  rating: number;
  feedback?: string;
  reviewedAt?: string;
};

export type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
  rating?: { average: number; count: number };
  reviews?: Review[];
  tutor?: {
    name: string;
    email: string;
    image?: string;
    bio?: string;
    phone?: string;
    plan: "free" | "pro";
  };
};

export type Application = {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorName: string;
  tutorEmail: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
  rating?: number;
  feedback?: string;
  reviewedAt?: string;
};

export type Payment = {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: string;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId?: string;
  paymentStatus?: "paid";
  paidAt: string;
};
