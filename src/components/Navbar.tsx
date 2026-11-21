"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Container from "@/components/Container";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
];

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
    <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur'>
      <Container className='flex h-16 items-center justify-between'>
        {/* Logo */}
        <Link
          href='/'
          className='flex items-center gap-2 text-xl font-bold text-primary'>
          <GraduationCap className='h-7 w-7' />
          MentorLagbe
        </Link>

        {/* Desktop links */}
        <nav className='hidden items-center gap-6 md:flex'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className='hidden items-center gap-3 md:flex'>
          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className='flex items-center gap-2 outline-none'>
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm font-medium'>{user.name}</span>
                <Badge variant='secondary' className='capitalize'>
                  {user.role}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuLabel className='truncate'>
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/dashboard'>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/dashboard/profile'>Update Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant='outline' asChild>
                <Link href='/sign-in'>Sign In</Link>
              </Button>
              <Button asChild>
                <Link href='/sign-up'>Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden'
          onClick={() => setOpen(!open)}>
          {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </Button>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className='border-t md:hidden'>
          <Container className='flex flex-col gap-1 py-3'>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className='rounded-md px-3 py-2 text-sm font-medium hover:bg-muted'>
                {link.label}
              </Link>
            ))}
            <div className='my-2 border-t' />
            {user ? (
              <>
                <div className='flex items-center gap-2 px-3 py-2'>
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-sm font-medium'>{user.name}</span>
                  <Badge variant='secondary' className='capitalize'>
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
                <Button variant='outline' onClick={handleLogout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <div className='flex gap-2'>
                <Button variant='outline' asChild className='flex-1'>
                  <Link href='/sign-in' onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className='flex-1'>
                  <Link href='/sign-up' onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
