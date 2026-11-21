"use client";

import { useState, type FormEvent } from "react";
import {
  CalendarDays,
  Camera,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageTitle from "@/components/PageTitle";
import { useAuth } from "@/context/AuthContext";
import { api, errorMessage } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [image, setImage] = useState(user?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // The dashboard layout waits for the database user before rendering this
  // page, so the values above are already filled on a hard reload.
  if (!user) return null;

  async function handleImage(file?: File) {
    if (!file) return;
    try {
      setUploading(true);
      setImage(await uploadImage(file));
      toast.success("Image uploaded. Click Save to keep it.");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);
      await api("/users/me", {
        method: "PATCH",
        body: { name: name.trim(), phone, bio, image },
      });
      await refreshUser();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const initial = name.trim().charAt(0).toUpperCase() || "M";

  return (
    <div className='max-w-5xl'>
      <PageTitle
        title='My Profile'
        description='Keep your contact details and profile picture up to date.'
      />

      <div className='grid gap-6 lg:grid-cols-[300px_1fr]'>
        <Card className='h-fit'>
          <CardContent className='flex flex-col items-center text-center'>
            <Avatar className='h-24 w-24 ring-4 ring-primary/10'>
              <AvatarImage src={image} alt={name || user.name} />
              <AvatarFallback className='text-3xl'>{initial}</AvatarFallback>
            </Avatar>
            <h2 className='mt-4 text-lg font-semibold'>{name || user.name}</h2>
            <p className='mt-1 flex items-center gap-1.5 text-sm text-muted-foreground'>
              <Mail className='h-3.5 w-3.5' /> {user.email}
            </p>
            <div className='mt-3 flex flex-wrap justify-center gap-2'>
              <Badge variant='secondary' className='capitalize'>
                {user.role}
              </Badge>
              <Badge variant='outline' className='uppercase'>
                <Sparkles className='mr-1 h-3 w-3' />
                {user.plan} plan
              </Badge>
            </div>
            <div className='mt-5 w-full space-y-2 border-t pt-4 text-left text-sm'>
              <p className='flex items-center gap-2 text-muted-foreground'>
                <CalendarDays className='h-4 w-4' />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className='flex items-center gap-2 text-muted-foreground'>
                <ShieldCheck className='h-4 w-4' />
                Verified {user.role} account
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
            <CardDescription>
              Your name and photo are visible on applications and tuition posts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='flex flex-col gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center'>
                <div className='relative'>
                  <Avatar className='h-16 w-16'>
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback className='text-xl'>{initial}</AvatarFallback>
                  </Avatar>
                  <span className='absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground'>
                    <Camera className='h-3 w-3' />
                  </span>
                </div>
                <div className='flex-1 space-y-2'>
                  <Label htmlFor='photo'>Profile Picture</Label>
                  <Input
                    id='photo'
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleImage(e.target.files?.[0])}
                  />
                  <p className='text-xs text-muted-foreground'>
                    {uploading
                      ? "Uploading image..."
                      : "JPG, PNG or WebP. Uploaded through ImgBB."}
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='image'>Image URL (optional)</Label>
                <Input
                  id='image'
                  type='url'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder='https://...'
                />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Your full name'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone</Label>
                  <Input
                    id='phone'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='+880 1XXX-XXXXXX'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Email</Label>
                <Input value={user.email} disabled />
                <p className='text-xs text-muted-foreground'>
                  Email is managed by your BetterAuth account.
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder='Tell students or tutors a little about yourself...'
                />
              </div>

              <div className='flex justify-end'>
                <Button type='submit' disabled={saving || uploading}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
