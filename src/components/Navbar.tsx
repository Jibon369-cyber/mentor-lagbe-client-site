"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  LayoutDashboard,
  LogOut,
  Menu,
  User as UserIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully");
    setOpen(false);
    router.push("/");
  }

  return (
    <header className='sticky top-0 z-50 border-b bg-background/85 backdrop-blur-xl'>
      <Container className='flex h-16 items-center justify-between gap-4'>
        <Logo />

        {/* Desktop links */}
        <nav className='hidden items-center gap-1 md:flex'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                isActive(pathname, link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className='hidden items-center gap-2 md:flex'>
          <ThemeToggle />
          <NotificationBell />
          {loading ? (
            <div className='h-9 w-28 animate-pulse rounded-md bg-muted' />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className='flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 outline-none transition-colors hover:bg-muted'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className='max-w-28 truncate text-sm font-medium'>
                  {user.name}
                </span>
                <Badge variant='secondary' className='capitalize'>
                  {user.role}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className='truncate'>
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>
                <DropdownMenuItem render={<Link href='/dashboard' />}>
                  <LayoutDashboard className='mr-2 h-4 w-4' /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link href='/dashboard/profile' />}>
                  <UserIcon className='mr-2 h-4 w-4' /> Update Profile
                </DropdownMenuItem>
                {user.role === "student" && (
                  <DropdownMenuItem
                    render={
                      <Link href='/dashboard/student/saved-tuitions' />
                    }>
                    <Bookmark className='mr-2 h-4 w-4' /> Saved Tuitions
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className='mr-2 h-4 w-4' /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href='/sign-in'
                className={buttonVariants({ variant: "ghost" })}>
                Sign In
              </Link>
              <Link href='/sign-up' className={buttonVariants()}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile buttons */}
        <div className='flex items-center gap-1 md:hidden'>
          <ThemeToggle />
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setOpen(!open)}
            aria-label='Toggle menu'
            aria-expanded={open}>
            {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </Button>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className='border-t bg-background md:hidden'>
          <Container className='flex flex-col gap-1 py-3'>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                  isActive(pathname, link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground",
                )}>
                {link.label}
              </Link>
            ))}
            <div className='my-2 border-t' />
            {loading ? (
              <div className='h-10 animate-pulse rounded-md bg-muted' />
            ) : user ? (
              <>
                <div className='flex items-center gap-2 px-3 py-2'>
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium'>{user.name}</p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {user.email}
                    </p>
                  </div>
                  <Badge variant='secondary' className='ml-auto capitalize'>
                    {user.role}
                  </Badge>
                </div>
                <Link
                  href='/dashboard'
                  onClick={() => setOpen(false)}
                  className='rounded-md px-3 py-2 text-sm hover:bg-muted'>
                  Dashboard
                </Link>
                <Link
                  href='/dashboard/profile'
                  onClick={() => setOpen(false)}
                  className='rounded-md px-3 py-2 text-sm hover:bg-muted'>
                  Update Profile
                </Link>
                {user.role === "student" && (
                  <Link
                    href='/dashboard/student/saved-tuitions'
                    onClick={() => setOpen(false)}
                    className='rounded-md px-3 py-2 text-sm hover:bg-muted'>
                    Saved Tuitions
                  </Link>
                )}
                <Button
                  variant='outline'
                  className='mt-1'
                  onClick={handleLogout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <div className='flex gap-2'>
                <Link
                  href='/sign-in'
                  onClick={() => setOpen(false)}
                  className={buttonVariants({
                    variant: "outline",
                    className: "flex-1",
                  })}>
                  Sign In
                </Link>
                <Link
                  href='/sign-up'
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ className: "flex-1" })}>
                  Sign Up
                </Link>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
