"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASS_LEVELS, MODES, SUBJECTS } from "@/lib/constants";
import { errorMessage } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import type { Tuition } from "@/lib/types";

export type TuitionFormData = {
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  monthlyFee: string;
  daysPerWeek: string;
  bannerImage: string;
  description: string;
};

type Props = {
  initial?: Tuition; // pass this when editing
  submitLabel: string;
  onSubmit: (data: TuitionFormData) => Promise<void>;
};

// Used by "Post Tuition" page and the "Edit" dialog
export default function TuitionForm({ initial, submitLabel, onSubmit }: Props) {
  const [form, setForm] = useState<TuitionFormData>({
    title: initial?.title ?? "",
    subject: initial?.subject ?? "",
    classLevel: initial?.classLevel ?? "",
    mode: initial?.mode ?? "",
    location: initial?.location ?? "",
    monthlyFee: initial ? String(initial.monthlyFee) : "",
    daysPerWeek: initial ? String(initial.daysPerWeek) : "",
    bannerImage: initial?.bannerImage ?? "",
    description: initial?.description ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function setField(name: keyof TuitionFormData, value: string) {
    setForm({ ...form, [name]: value });
  }

  async function handleImage(file?: File) {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setForm((old) => ({ ...old, bannerImage: url }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.subject ||
      !form.classLevel ||
      !form.mode ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    if (Number(form.monthlyFee) <= 0 || Number(form.daysPerWeek) <= 0) {
      toast.error("Monthly fee and days per week must be greater than 0");
      return;
    }
    if (Number(form.daysPerWeek) > 7) {
      toast.error("Days per week cannot be more than 7");
      return;
    }
    if (!form.bannerImage) {
      toast.error("Please upload a banner image");
      return;
    }

    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder='e.g. Class 10 Math Batch'
        />
      </div>

      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <Label>Subject</Label>
          <Select
            value={form.subject}
            onValueChange={(v) => setField("subject", v)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select subject' />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label>Class Level</Label>
          <Select
            value={form.classLevel}
            onValueChange={(v) => setField("classLevel", v)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select level' />
            </SelectTrigger>
            <SelectContent>
              {CLASS_LEVELS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label>Mode</Label>
          <Select value={form.mode} onValueChange={(v) => setField("mode", v)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select mode' />
            </SelectTrigger>
            <SelectContent>
              {MODES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <Label htmlFor='location'>Location</Label>
          <Input
            id='location'
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            placeholder='Dhaka - Dhanmondi or Zoom'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='fee'>Monthly Fee (৳)</Label>
          <Input
            id='fee'
            type='number'
            min={1}
            value={form.monthlyFee}
            onChange={(e) => setField("monthlyFee", e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='days'>Days / Week</Label>
          <Input
            id='days'
            type='number'
            min={1}
            max={7}
            value={form.daysPerWeek}
            onChange={(e) => setField("daysPerWeek", e.target.value)}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='banner'>Banner Image</Label>
        <Input
          id='banner'
          type='file'
          accept='image/*'
          onChange={(e) => handleImage(e.target.files?.[0])}
        />
        {uploading && (
          <p className='text-sm text-muted-foreground'>Uploading image...</p>
        )}
        {form.bannerImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.bannerImage}
            alt='Banner preview'
            className='aspect-video w-full max-w-xs rounded-md object-cover'
          />
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          rows={4}
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </div>

      <Button type='submit' disabled={saving || uploading}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
