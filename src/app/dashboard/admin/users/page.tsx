"use client";

import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  const { data, loading, error, reload } = useFetch<User[]>("/admin/users");

  async function changeRole(id: string, role: string) {
    try {
      await api(`/admin/users/${id}/role`, { method: "PATCH", body: { role } });
      toast.success("Role updated");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  if (loading) return <Loader />;
  if (error) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle
        title='User Management'
        description='See all users and change their roles.'
      />
      <Card>
        <CardContent>
          <Table>
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
                      onValueChange={(role) => changeRole(user._id, role)}
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
        </CardContent>
      </Card>
    </>
  );
}
