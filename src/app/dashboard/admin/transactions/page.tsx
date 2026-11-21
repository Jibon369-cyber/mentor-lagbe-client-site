"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { useFetch } from "@/hooks/useFetch";
import type { Payment } from "@/lib/types";

export default function AdminTransactionsPage() {
  const { data, loading, error } = useFetch<Payment[]>("/admin/payments");

  if (loading) return <Loader />;
  if (error) return <p className='text-red-600'>{error}</p>;

  return (
    <>
      <PageTitle
        title='Transactions'
        description='All Stripe Pro plan payments.'
      />
      <Card>
        <CardContent>
          {data?.length === 0 ? (
            <p className='py-6 text-center text-muted-foreground'>
              No payments yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className='font-medium'>
                      {payment.userName}
                    </TableCell>
                    <TableCell>{payment.userEmail}</TableCell>
                    <TableCell>
                      <Badge variant='secondary' className='capitalize'>
                        {payment.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.planName}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell
                      className='max-w-40 truncate'
                      title={payment.transactionId}>
                      {payment.transactionId}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
