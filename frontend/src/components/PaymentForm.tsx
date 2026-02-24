import React, { useState } from 'react';
import { useCreatePayment } from '../hooks/usePayments';
import { PaymentMethod } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', label: 'USD – US Dollar', symbol: '$' },
  { code: 'EUR', label: 'EUR – Euro', symbol: '€' },
  { code: 'GBP', label: 'GBP – British Pound', symbol: '£' },
  { code: 'CAD', label: 'CAD – Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', label: 'AUD – Australian Dollar', symbol: 'A$' },
  { code: 'JPY', label: 'JPY – Japanese Yen', symbol: '¥' },
  { code: 'CHF', label: 'CHF – Swiss Franc', symbol: 'CHF' },
  { code: 'NZD', label: 'NZD – New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SGD', label: 'SGD – Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', label: 'HKD – Hong Kong Dollar', symbol: 'HK$' },
  { code: 'INR', label: 'INR – Indian Rupee', symbol: '₹' },
  { code: 'MXN', label: 'MXN – Mexican Peso', symbol: 'MX$' },
  { code: 'BRL', label: 'BRL – Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', label: 'ZAR – South African Rand', symbol: 'R' },
  { code: 'AED', label: 'AED – UAE Dirham', symbol: 'AED' },
];

const PAYMENT_METHODS = [
  { value: PaymentMethod.creditCard, label: 'Credit Card', icon: '💳' },
  { value: PaymentMethod.debitCard, label: 'Debit Card', icon: '🏦' },
  { value: PaymentMethod.paypal, label: 'PayPal', icon: '🅿️' },
  { value: PaymentMethod.applePay, label: 'Apple Pay', icon: '🍎' },
  { value: PaymentMethod.googlePay, label: 'Google Pay', icon: '🔵' },
];

const CARD_TYPES = [
  { value: 'Visa', label: 'Visa' },
  { value: 'Mastercard', label: 'Mastercard' },
  { value: 'Amex', label: 'American Express' },
  { value: 'Discover', label: 'Discover' },
  { value: 'JCB', label: 'JCB' },
  { value: 'Diners Club', label: 'Diners Club' },
  { value: 'UnionPay', label: 'UnionPay' },
];

const isCardMethod = (method: PaymentMethod) =>
  method === PaymentMethod.creditCard || method === PaymentMethod.debitCard;

export default function PaymentForm() {
  const createPayment = useCreatePayment();
  const [amount, setAmount] = useState('');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.creditCard);
  const [cardType, setCardType] = useState<string>('Visa');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCurrency = CURRENCIES.find(c => c.code === currencyCode) ?? CURRENCIES[0];
  const showCardType = isCardMethod(paymentMethod);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid payment amount greater than zero.');
      return;
    }

    if (!currencyCode) {
      setError('Please select a currency.');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    if (showCardType && !cardType) {
      setError('Please select a card type.');
      return;
    }

    // Store as cents (integer) to avoid floating point issues
    const amountBigInt = BigInt(Math.round(amountNum * 100));
    const resolvedCardType = showCardType ? cardType : null;

    try {
      await createPayment.mutateAsync({
        amount: amountBigInt,
        currencyCode,
        paymentMethod,
        cardType: resolvedCardType,
      });
      setSuccess(true);
      setAmount('');
      setCurrencyCode('USD');
      setPaymentMethod(PaymentMethod.creditCard);
      setCardType('Visa');
    } catch (err: any) {
      setError(err?.message ?? 'An error occurred while submitting your payment request.');
    }
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
        <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          Submit Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {success && (
          <Alert className="mb-4 border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-700" />
            <AlertDescription className="text-emerald-800 text-sm">
              Payment request submitted successfully. Our team will process it shortly.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-700" />
            <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount + Currency Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="payAmount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                  {selectedCurrency.symbol}
                </span>
                <Input
                  id="payAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-9 border-border text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Currency
              </Label>
              <Select value={currencyCode} onValueChange={setCurrencyCode}>
                <SelectTrigger className="border-border text-sm">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payment Method
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.value}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded border cursor-pointer transition-colors text-sm font-medium ${
                    paymentMethod === method.value
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => {
                      setPaymentMethod(method.value);
                      if (!isCardMethod(method.value)) setCardType('');
                      else setCardType('Visa');
                    }}
                    className="sr-only"
                  />
                  <span>{method.icon}</span>
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Card Type (only for credit/debit card) */}
          {showCardType && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Card Network
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CARD_TYPES.map(ct => (
                  <label
                    key={ct.value}
                    className={`flex items-center justify-center px-3 py-2 rounded border cursor-pointer transition-colors text-sm font-medium ${
                      cardType === ct.value
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardType"
                      value={ct.value}
                      checked={cardType === ct.value}
                      onChange={() => setCardType(ct.value)}
                      className="sr-only"
                    />
                    {ct.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground bg-muted/40 rounded p-3 border border-border">
            <strong className="text-foreground">Note:</strong> Submitting this form records your payment request with our team. We will contact you to complete the transaction securely. Payments are received via PayPal.
          </p>

          <Button
            type="submit"
            disabled={createPayment.isPending || !amount}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {createPayment.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing…</>
            ) : (
              <><CreditCard className="h-4 w-4 mr-2" />Submit Payment Request</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
