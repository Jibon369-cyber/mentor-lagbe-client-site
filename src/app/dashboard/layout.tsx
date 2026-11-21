"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Bookmark,
  ClipboardCheck,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Plus,
  Search,
  Sparkles,
  User as UserIcon,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Loader from "@/components/Loader";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

type NavItem = { href: string; label: string; icon: LucideIcon };

const menu: Record<Role, NavItem[]> = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    {
      href: "/dashboard/student/my-applications",
      label: "My Applications",
      icon: FileText,
    },
    {
      href: "/dashboard/student/saved-tuitions",
      label: "Saved Tuitions",
      icon: Bookmark,
    },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
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
      href: "/dashboard/admin/notifications",
      label: "Notifications",
      icon: Bell,
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

  // Sidebar is closed by default on small screens.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (window.innerWidth < 768) setOpen(false);
    });
    return () => cancelAnimationFrame(frame);
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
    <div className='flex min-h-screen bg-muted/30'>
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
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform md:static",
          open ? "translate-x-0" : "-translate-x-full md:hidden",
        )}>
        <div className='flex h-16 items-center border-b px-5'>
          <Logo />
        </div>

        {/* user profile summary */}
        <div className='flex items-center gap-3 border-b p-4'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold'>{user.name}</p>
            <p className='truncate text-xs text-muted-foreground'>
              {user.email}
            </p>
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
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard/profile" &&
                pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeOnMobile}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}>
                <item.icon className='h-4 w-4' />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className='space-y-2 border-t p-3'>
          {user.plan === "free" && user.role !== "admin" && (
            <Link
              href='/pricing'
              className='block rounded-xl border border-primary/20 bg-primary/5 p-3 transition-colors hover:bg-primary/10'>
              <p className='flex items-center gap-1.5 text-sm font-semibold text-primary'>
                <Sparkles className='h-4 w-4' /> Upgrade to Pro
              </p>
              <p className='mt-1 text-xs text-muted-foreground'>
                {user.role === "tutor"
                  ? "Unlimited posts and a verified badge."
                  : "Priority booking and more visibility."}
              </p>
            </Link>
          )}
          <Link
            href='/tuitions'
            className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'>
            <Search className='h-4 w-4' /> Browse Tuitions
          </Link>
          <Link
            href='/'
            className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'>
            <Home className='h-4 w-4' /> Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'>
            <LogOut className='h-4 w-4' /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur-xl sm:px-6'>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setOpen(!open)}
              aria-label='Toggle sidebar'>
              <Menu className='h-5 w-5' />
            </Button>
            <div className='hidden sm:block'>
              <p className='text-sm font-semibold capitalize'>
                {user.role} dashboard
              </p>
              <p className='text-xs text-muted-foreground'>
                Welcome back, {user.name.split(" ")[0]}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {user.plan === "free" && user.role !== "admin" && (
              <Link
                href='/pricing'
                className={buttonVariants({
                  size: "sm",
                  className: "hidden sm:inline-flex",
                })}>
                <Sparkles className='mr-1.5 h-3.5 w-3.5' /> Upgrade
              </Link>
            )}
            <NotificationBell />
            <ThemeToggle />
            <Link
              href='/dashboard/profile'
              className='flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-2 transition-colors hover:bg-muted'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className='hidden max-w-28 truncate text-sm font-medium sm:block'>
                {user.name}
              </span>
            </Link>
          </div>
        </header>

        <main className='flex-1 p-4 sm:p-6 lg:p-8'>{children}</main>
      </div>
    </div>
  );
}
