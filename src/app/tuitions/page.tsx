"use client";

import { Suspense, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Container from "@/components/Container";
import TuitionCard from "@/components/TuitionCard";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";
import { CLASS_LEVELS, MODES, SUBJECTS } from "@/lib/constants";
import type { Tuition } from "@/lib/types";

type TuitionsResponse = {
  tuitions: Tuition[];
  total: number;
  page: number;
  totalPages: number;
};

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function BrowseContent() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(params.get("search") ?? "");
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [subject, setSubject] = useState(params.get("subject") ?? "all");
  const [classLevel, setClassLevel] = useState(
    params.get("classLevel") ?? "all",
  );
  const [mode, setMode] = useState(params.get("mode") ?? "all");
  const [page, setPage] = useState(Number(params.get("page")) || 1);

  // Build the query string. Search, filter and pagination all happen on the server.
  const query = new URLSearchParams({ page: String(page), limit: "9" });
  if (search) query.set("search", search);
  if (subject !== "all") query.set("subject", subject);
  if (classLevel !== "all") query.set("classLevel", classLevel);
  if (mode !== "all") query.set("mode", mode);

  const { data, loading, error } = useFetch<TuitionsResponse>(
    `/tuitions?${query.toString()}`,
  );

  function syncUrl(next: {
    search?: string;
    subject?: string;
    classLevel?: string;
    mode?: string;
    page?: number;
  }) {
    const nextQuery = new URLSearchParams();
    const values = {
      search: next.search ?? search,
      subject: next.subject ?? subject,
      classLevel: next.classLevel ?? classLevel,
      mode: next.mode ?? mode,
      page: next.page ?? page,
    };

    if (values.search) nextQuery.set("search", values.search);
    if (values.subject !== "all") nextQuery.set("subject", values.subject);
    if (values.classLevel !== "all")
      nextQuery.set("classLevel", values.classLevel);
    if (values.mode !== "all") nextQuery.set("mode", values.mode);
    if (values.page > 1) nextQuery.set("page", String(values.page));

    router.replace(
      nextQuery.size ? `${pathname}?${nextQuery.toString()}` : pathname,
      { scroll: false },
    );
  }

  function changeFilter(
    setter: (value: string) => void,
    value: string,
    key: "subject" | "classLevel" | "mode",
  ) {
    setter(value);
    setPage(1);
    if (key === "subject") syncUrl({ subject: value, page: 1 });
    else if (key === "classLevel") syncUrl({ classLevel: value, page: 1 });
    else syncUrl({ mode: value, page: 1 });
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const value = searchInput.trim();
    setSearch(value);
    setPage(1);
    syncUrl({ search: value, page: 1 });
  }

  function clearAll() {
    setSearchInput("");
    setSearch("");
    setSubject("all");
    setClassLevel("all");
    setMode("all");
    setPage(1);
    router.replace(pathname, { scroll: false });
  }

  const hasFilters =
    Boolean(search) || subject !== "all" || classLevel !== "all" || mode !== "all";

  return (
    <Container className='py-10 md:py-14'>
      <div className='mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
        <div>
          <p className='text-sm font-medium text-primary'>Find your match</p>
          <h1 className='mt-1 text-3xl font-bold tracking-tight md:text-4xl'>
            Browse Tuitions
          </h1>
          <p className='mt-2 max-w-2xl text-muted-foreground'>
            Search and filter admin-approved tuitions from verified tutors.
          </p>
        </div>
        <div className='rounded-xl border bg-card px-4 py-3 text-sm shadow-sm'>
          <span className='font-semibold text-foreground'>
            {data?.total ?? 0}
          </span>{" "}
          <span className='text-muted-foreground'>tuitions found</span>
        </div>
      </div>

      {/* Search + filters */}
      <div className='mb-8 space-y-4 rounded-2xl border bg-card p-4 shadow-sm md:p-5'>
        <form onSubmit={handleSearch} className='flex flex-col gap-2 sm:flex-row'>
          <div className='relative flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Search by title, subject or tutor name...'
              className='pl-9'
            />
          </div>
          <Button type='submit'>
            <Search className='mr-1 h-4 w-4' /> Search
          </Button>
        </form>

        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <FilterSelect
            value={subject}
            onChange={(v) => changeFilter(setSubject, v, "subject")}
            placeholder='All Subjects'
            options={SUBJECTS}
          />
          <FilterSelect
            value={classLevel}
            onChange={(v) => changeFilter(setClassLevel, v, "classLevel")}
            placeholder='All Class Levels'
            options={CLASS_LEVELS}
          />
          <FilterSelect
            value={mode}
            onChange={(v) => changeFilter(setMode, v, "mode")}
            placeholder='Online / Offline'
            options={MODES}
          />
          <Button
            variant='outline'
            onClick={clearAll}
            disabled={!hasFilters}
            className='gap-2'>
            <X className='h-4 w-4' /> Clear Filters
          </Button>
        </div>

        {hasFilters && (
          <p className='flex items-center gap-2 text-xs text-muted-foreground'>
            <SlidersHorizontal className='h-3.5 w-3.5' />
            Filters are applied on the server for accurate results.
          </p>
        )}
      </div>

      {/* Results */}
      {error && (
        <p className='rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300'>
          {error}
        </p>
      )}

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-[430px] w-full rounded-xl' />
            ))
          : data?.tuitions.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
      </div>

      {!loading && data?.tuitions.length === 0 && (
        <div className='rounded-2xl border border-dashed bg-muted/30 p-12 text-center'>
          <Search className='mx-auto h-10 w-10 text-muted-foreground' />
          <p className='mt-3 font-semibold'>No tuitions found</p>
          <p className='mt-1 text-sm text-muted-foreground'>
            Try a different subject, class level or mode.
          </p>
          <Button variant='outline' onClick={clearAll} className='mt-4'>
            Clear filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className='mt-10 flex flex-wrap items-center justify-center gap-2'>
          <Button
            variant='outline'
            disabled={page === 1}
            onClick={() => {
              setPage(page - 1);
              syncUrl({ page: page - 1 });
            }}>
            Previous
          </Button>
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
            (number) => (
              <Button
                key={number}
                variant={number === page ? "default" : "outline"}
                onClick={() => {
                  setPage(number);
                  syncUrl({ page: number });
                }}>
                {number}
              </Button>
            ),
          )}
          <Button
            variant='outline'
            disabled={page === data.totalPages}
            onClick={() => {
              setPage(page + 1);
              syncUrl({ page: page + 1 });
            }}>
            Next
          </Button>
        </div>
      )}
    </Container>
  );
}

// useSearchParams needs a Suspense wrapper
export default function BrowseTuitionsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowseContent />
    </Suspense>
  );
}
