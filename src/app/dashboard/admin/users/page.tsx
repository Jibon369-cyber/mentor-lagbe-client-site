"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageTitle from "@/components/PageTitle";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import { api, errorMessage } from "@/lib/api";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (roleFilter !== "all") query.set("role", roleFilter);

  const { data, loading, error, reload } = useFetch<User[]>(
    `/admin/users?${query.toString()}`,
  );

  async function changeRole(id: string, role: string) {
    try {
      await api(`/admin/users/${id}/role`, { method: "PATCH", body: { role } });
      toast.success("Role updated");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  return (
    <>
      <PageTitle
        title='User Management'
        description='See all registered users and change their platform role.'
      />

      <div className='mb-4 flex flex-col gap-2 sm:flex-row'>
        <form onSubmit={handleSearch} className='flex flex-1 gap-2'>
          <div className='relative flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder='Search by name or email...'
              className='pl-9'
            />
          </div>
          <Button type='submit' variant='outline'>
            Search
          </Button>
        </form>
        <Select
          value={roleFilter}
          onValueChange={(value) => value && setRoleFilter(value)}>
          <SelectTrigger className='w-full sm:w-44'>
            <SelectValue placeholder='All roles' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All roles</SelectItem>
            <SelectItem value='student'>Students</SelectItem>
            <SelectItem value='tutor'>Tutors</SelectItem>
            <SelectItem value='admin'>Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className='mb-4 text-red-600'>{error}</p>}
      {loading ? (
        <Loader />
      ) : (
        <Card>
          <CardContent className='overflow-x-auto'>
            <Table className='min-w-[760px]'>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className='uppercase'>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(role) =>
                          role && changeRole(user._id, role)
                        }
                        disabled={user._id === me?._id}>
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='student'>Student</SelectItem>
                          <SelectItem value='tutor'>Tutor</SelectItem>
                          <SelectItem value='admin'>Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data?.length === 0 && (
              <p className='py-8 text-center text-muted-foreground'>
                No users match this search.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
