"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = {
  applicationId: string;
  tuitionTitle: string;
  initialRating?: number;
  initialFeedback?: string;
  onSubmitted?: () => void;
};

export default function ReviewDialog({
  applicationId,
  tuitionTitle,
  initialRating = 0,
  initialFeedback = "",
  onSubmitted,
}: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (rating < 1) {
      toast.error("Please select a rating from 1 to 5 stars");
      return;
    }

    try {
      setSaving(true);
      await api("/student/reviews", {
        method: "POST",
        body: { applicationId, rating, feedback },
      });
      toast.success("Thank you! Your review has been published.");
      setOpen(false);
      onSubmitted?.();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size='sm' variant={initialRating ? "outline" : "default"} />
        }>
        {initialRating ? `Edit review (${initialRating}★)` : "Leave a review"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialRating ? "Update your review" : "Rate this tuition"}
          </DialogTitle>
          <DialogDescription>{tuitionTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <Label>Your rating</Label>
            <div className='flex items-center gap-1'>
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                const active = value <= (hovered || rating);
                return (
                  <button
                    key={value}
                    type='button'
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHovered(value)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    className='rounded p-0.5 transition-transform hover:scale-110'>
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        active
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/40",
                      )}
                    />
                  </button>
                );
              })}
              <span className='ml-2 text-sm font-medium text-muted-foreground'>
                {rating > 0 ? `${rating} / 5` : "Select a rating"}
              </span>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='feedback'>Feedback (optional)</Label>
            <Textarea
              id='feedback'
              rows={4}
              maxLength={1000}
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder='Share how the classes helped you. Your feedback helps other students.'
            />
            <p className='text-right text-xs text-muted-foreground'>
              {feedback.length}/1000
            </p>
          </div>

          <Button type='submit' className='w-full' disabled={saving}>
            {saving ? "Publishing..." : "Publish review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
