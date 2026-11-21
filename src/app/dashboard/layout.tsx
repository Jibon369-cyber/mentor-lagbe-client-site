"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Plus,
  User as UserIcon,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

type NavItem = { href: string; label: string; icon: LucideIcon };

const menu: Record<Role, NavItem[]> = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/student/my-applications",
      label: "My Applications",
      icon: FileText,
    },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/tutor/post-tuition",
      label: "Post a Tuition",
      icon: Plus,
    },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: List },
    {
      href: "/dashboard/tutor/applicants",
      label: "Applicants",
      icon: UserCheck,
    },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    {
      href: "/dashboard/admin/tuitions",
      label: "Tuition Approval",
      icon: ClipboardCheck,
    },
    {
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      icon: CreditCard,
    },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  // Sidebar is closed by default on small screens
  useEffect(() => {
    if (window.innerWidth < 768) setOpen(false);
  }, []);

  // e.g. /dashboard/tutor/my-tuitions -> "tutor"
  const section = pathname.split("/")[2];
  const wrongSection =
    !!user &&
    ["student", "tutor", "admin"].includes(section) &&
    section !== user.role;

  useEffect(() => {
    if (loading) return; // wait! so a page reload does not send a logged-in user to login
    if (!user) router.replace("/sign-in");
    else if (wrongSection) router.replace(`/dashboard/${user.role}`);
  }, [loading, user, wrongSection, router]);

  if (loading || !user || wrongSection) return <Loader full />;

  const items: NavItem[] = [
    ...menu[user.role],
    { href: "/dashboard/profile", label: "Update Profile", icon: UserIcon },
  ];

  function closeOnMobile() {
    if (window.innerWidth < 768) setOpen(false);
  }

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully");
    router.push("/");
  }

  return (
    <div className='flex min-h-screen bg-muted/40'>
      {/* dark overlay on mobile */}
      {open && (
        <div
          className='fixed inset-0 z-30 bg-black/40 md:hidden'
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform md:static",
          open ? "translate-x-0" : "-translate-x-full md:hidden",
        )}>
        <Link
          href='/'
          className='flex h-16 items-center gap-2 border-b px-6 text-xl font-bold text-primary'>
          <GraduationCap className='h-7 w-7' />
          MentorLagbe
        </Link>

        {/* user profile summary */}
        <div className='flex items-center gap-3 border-b p-4'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold'>{user.name}</p>
            <div className='mt-1 flex gap-1'>
              <Badge variant='secondary' className='capitalize'>
                {user.role}
              </Badge>
              <Badge variant='outline' className='uppercase'>
                {user.plan}
              </Badge>
            </div>
          </div>
        </div>

        <nav className='flex-1 space-y-1 overflow-y-auto p-3'>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeOnMobile}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}>
              <item.icon className='h-4 w-4' />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className='space-y-1 border-t p-3'>
          <Link
            href='/'
            className='flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted'>
            <Home className='h-4 w-4' /> Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted'>
            <LogOut className='h-4 w-4' /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='flex h-16 items-center justify-between border-b bg-background px-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setOpen(!open)}
            aria-label='Toggle sidebar'>
            <Menu className='h-5 w-5' />
          </Button>
          <div className='flex items-center gap-3'>
            <span className='hidden text-sm font-medium sm:block'>
              {user.name}
            </span>
            <Avatar>
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className='flex-1 p-4 sm:p-6'>{children}</main>
      </div>
    </div>
  );
}
