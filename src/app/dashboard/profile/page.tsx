"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        body: { name, phone, bio, image },
      });
      await refreshUser();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='max-w-2xl'>
      <PageTitle
        title='Update Profile'
        description='Change your name, phone, bio and profile picture.'
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-20 w-20'>
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className='text-2xl'>
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 space-y-2'>
                <Label htmlFor='photo'>Profile Picture</Label>
                <Input
                  id='photo'
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImage(e.target.files?.[0])}
                />
                {uploading && (
                  <p className='text-sm text-muted-foreground'>Uploading...</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
            <div className='flex gap-2'>
              <Badge variant='secondary' className='capitalize'>
                {user.role}
              </Badge>
              <Badge variant='outline' className='uppercase'>
                {user.plan} plan
              </Badge>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone</Label>
              <Input
                id='phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='bio'>Bio</Label>
              <Textarea
                id='bio'
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <Button type='submit' disabled={saving || uploading}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
