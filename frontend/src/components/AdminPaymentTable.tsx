import React from 'react';
import { useGetAllPayments, useUpdatePaymentStatus, useGetAdminPaymentSettings } from '../hooks/usePayments';
import { PaymentStatus, PaymentMethod } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Receipt, Mail, AlertCircle } from 'lucide-react';

function formatDate(time: bigint) {
  return new Date(Number(time) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatAmount(amount: bigint, currencyCode: string) {
  const value = Number(amount) / 100;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`;
  }
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    failed: 'bg-red-50 text-red-800 border-red-200',
  };
  const labels: Record<string, string> = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${styles[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {labels[status] ?? status}
    </span>
  );
}

function paymentMethodLabel(method: PaymentMethod, cardType?: string) {
  if (cardType) return cardType;
  const labels: Record<string, string> = {
    [PaymentMethod.paypal]: 'PayPal',
    [PaymentMethod.creditCard]: 'Credit Card',
    [PaymentMethod.debitCard]: 'Debit Card',
    [PaymentMethod.applePay]: 'Apple Pay',
    [PaymentMethod.googlePay]: 'Google Pay',
  };
  return labels[method] ?? method;
}

export default function AdminPaymentTable() {
  const { data: payments, isLoading } = useGetAllPayments();
  const { data: paymentSettings } = useGetAdminPaymentSettings();
  const updateStatus = useUpdatePaymentStatus();

  return (
    <div className="space-y-4">
      {/* PayPal Receiving Account Banner */}
      {paymentSettings?.paypalEmail ? (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <Mail className="h-4 w-4 text-blue-600 shrink-0" />
          <p className="text-sm text-blue-800">
            <span className="font-medium">PayPal:</span>{' '}
            <span className="font-semibold">{paymentSettings.paypalEmail}</span>
          </p>
        </div>
      ) : (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-700" />
          <AlertDescription className="text-amber-800 text-sm">
            No PayPal account configured. Go to <strong>Settings</strong> tab to add your PayPal email.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Client Payment Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : !payments || payments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <Receipt className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              No payment records on file.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/20">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Ref #</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Client</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Amount</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Card / Method</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Status</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Date</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Update Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, idx) => {
                    const clientStr = payment.client.toString();
                    const truncated = clientStr.length > 20
                      ? `${clientStr.slice(0, 10)}...${clientStr.slice(-8)}`
                      : clientStr;
                    return (
                      <TableRow
                        key={payment.id.toString()}
                        className={`border-b border-border hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}
                      >
                        <TableCell className="py-3 px-4 text-xs font-mono text-muted-foreground">
                          #{payment.id.toString().padStart(4, '0')}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-xs font-mono text-muted-foreground max-w-[140px] truncate" title={clientStr}>
                          {truncated}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm font-semibold text-foreground whitespace-nowrap">
                          {formatAmount(payment.amount, payment.currencyCode)}
                          <span className="ml-1.5 text-xs font-normal text-muted-foreground">{payment.currencyCode}</span>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm text-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            {paymentMethodLabel(payment.paymentMethod, payment.cardType)}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <PaymentStatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(payment.timestamp)}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <Select
                            value={payment.status}
                            onValueChange={async (val) => {
                              await updateStatus.mutateAsync({
                                paymentId: payment.id,
                                status: val as PaymentStatus,
                              });
                            }}
                            disabled={updateStatus.isPending}
                          >
                            <SelectTrigger className="h-8 text-xs w-32 border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={PaymentStatus.pending} className="text-xs">Pending</SelectItem>
                              <SelectItem value={PaymentStatus.completed} className="text-xs">Completed</SelectItem>
                              <SelectItem value={PaymentStatus.failed} className="text-xs">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
