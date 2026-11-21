"use client";

import { CreditCard, DollarSign, ReceiptText } from "lucide-react";
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
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";
import type { Payment } from "@/lib/types";

function formatAmount(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export default function AdminTransactionsPage() {
  const { data, loading, error } = useFetch<Payment[]>("/admin/payments");

  if (loading) return <Loader />;
  if (error) return <p className='text-destructive'>{error}</p>;

  const payments = data ?? [];
  const totalRevenue = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );
  const average = payments.length ? totalRevenue / payments.length : 0;

  return (
    <>
      <PageTitle
        title='Transactions'
        description='Every completed Stripe Pro payment, newest first.'
      />

      <div className='mb-6 grid gap-4 sm:grid-cols-3'>
        <StatCard
          title='Paid Transactions'
          value={payments.length}
          icon={ReceiptText}
        />
        <StatCard
          title='Total Revenue'
          value={formatAmount(totalRevenue)}
          icon={DollarSign}
        />
        <StatCard
          title='Average Order'
          value={formatAmount(average)}
          icon={CreditCard}
        />
      </div>

      <Card>
        <CardContent className='overflow-x-auto'>
          {payments.length === 0 ? (
            <p className='py-10 text-center text-muted-foreground'>
              No completed payments yet.
            </p>
          ) : (
            <Table className='min-w-[1000px]'>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Stripe Session</TableHead>
                  <TableHead>Paid At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      <p className='font-medium'>{payment.userName}</p>
                      <p className='text-xs text-muted-foreground'>
                        {payment.userEmail}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary' className='capitalize'>
                        {payment.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.planName}</TableCell>
                    <TableCell className='whitespace-nowrap font-medium'>
                      {formatAmount(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className='border-emerald-200 bg-emerald-50 capitalize text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300'>
                        {payment.paymentStatus ?? "paid"}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className='max-w-44 truncate font-mono text-xs'
                      title={payment.transactionId}>
                      {payment.transactionId}
                    </TableCell>
                    <TableCell
                      className='max-w-44 truncate font-mono text-xs'
                      title={payment.stripeSessionId}>
                      {payment.stripeSessionId ?? "—"}
                    </TableCell>
                    <TableCell className='whitespace-nowrap'>
                      {new Date(payment.paidAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
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
