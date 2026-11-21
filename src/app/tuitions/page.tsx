"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
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
    <Select value={value} onValueChange={onChange}>
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
  const [searchInput, setSearchInput] = useState(params.get("search") ?? "");
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [subject, setSubject] = useState(params.get("subject") ?? "all");
  const [classLevel, setClassLevel] = useState("all");
  const [mode, setMode] = useState("all");
  const [page, setPage] = useState(1);

  // Build the query string. Search, filter and pagination all happen on the server.
  const query = new URLSearchParams({ page: String(page), limit: "9" });
  if (search) query.set("search", search);
  if (subject !== "all") query.set("subject", subject);
  if (classLevel !== "all") query.set("classLevel", classLevel);
  if (mode !== "all") query.set("mode", mode);

  const { data, loading, error } = useFetch<TuitionsResponse>(
    `/tuitions?${query.toString()}`,
  );

  function changeFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function clearAll() {
    setSearchInput("");
    setSearch("");
    setSubject("all");
    setClassLevel("all");
    setMode("all");
    setPage(1);
  }

  return (
    <Container className='py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Browse Tuitions</h1>
        <p className='mt-2 text-muted-foreground'>
          Search and filter approved tuitions from verified tutors.
        </p>
      </div>

      {/* Search + filters */}
      <div className='mb-8 space-y-4 rounded-xl border bg-card p-4'>
        <form onSubmit={handleSearch} className='flex gap-2'>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Search by title or subject...'
          />
          <Button type='submit'>
            <Search className='mr-1 h-4 w-4' /> Search
          </Button>
        </form>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <FilterSelect
            value={subject}
            onChange={(v) => changeFilter(setSubject, v)}
            placeholder='All Subjects'
            options={SUBJECTS}
          />
          <FilterSelect
            value={classLevel}
            onChange={(v) => changeFilter(setClassLevel, v)}
            placeholder='All Class Levels'
            options={CLASS_LEVELS}
          />
          <FilterSelect
            value={mode}
            onChange={(v) => changeFilter(setMode, v)}
            placeholder='Online / Offline'
            options={MODES}
          />
          <Button variant='outline' onClick={clearAll}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      {error && <p className='text-center text-red-600'>{error}</p>}

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-96 w-full' />
            ))
          : data?.tuitions.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
      </div>

      {!loading && data?.tuitions.length === 0 && (
        <p className='py-10 text-center text-muted-foreground'>
          No tuitions found. Try different filters.
        </p>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className='mt-10 flex flex-wrap items-center justify-center gap-2'>
          <Button
            variant='outline'
            disabled={page === 1}
            onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
            (number) => (
              <Button
                key={number}
                variant={number === page ? "default" : "outline"}
                onClick={() => setPage(number)}>
                {number}
              </Button>
            ),
          )}
          <Button
            variant='outline'
            disabled={page === data.totalPages}
            onClick={() => setPage(page + 1)}>
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
