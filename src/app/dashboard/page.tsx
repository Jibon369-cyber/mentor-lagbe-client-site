"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";

// /dashboard sends each user to their own dashboard
export default function DashboardIndexPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(`/dashboard/${user.role}`);
  }, [user, router]);

  return <Loader />;
}
