import React, { useState, useEffect } from 'react';
import { useGetAdminPaymentSettings, useSetAdminPaymentSettings } from '../hooks/usePayments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, CheckCircle, AlertCircle, Loader2, Lock, Mail } from 'lucide-react';

export default function AdminPaymentSettings() {
  const { data: settings, isLoading } = useGetAdminPaymentSettings();
  const setSettings = useSetAdminPaymentSettings();

  const [paypalEmail, setPaypalEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setPaypalEmail(settings.paypalEmail ?? '');
    }
  }, [settings]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setEmailError(null);

    if (!paypalEmail.trim()) {
      setEmailError('PayPal email address is required.');
      return;
    }

    if (!validateEmail(paypalEmail.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    try {
      await setSettings.mutateAsync({ paypalEmail: paypalEmail.trim() });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save PayPal account settings.');
    }
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Payment Receiving Settings
          </CardTitle>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
            <Lock className="h-3 w-3" />
            Admin Only
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Info banner */}
        <div className="mb-5 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Mail className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">PayPal Receiving Account</p>
            <p className="text-xs text-blue-700 mt-0.5">
              All client payments will be directed to this PayPal account. Make sure this email is linked to an active PayPal business account. This information is <strong>only visible to you</strong> as the administrator.
            </p>
          </div>
        </div>

        {success && (
          <Alert className="mb-4 border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-700" />
            <AlertDescription className="text-emerald-800 text-sm">
              PayPal receiving account saved successfully. Clients will now be directed to send payments to <strong>{paypalEmail}</strong>.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-700" />
            <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-muted/40 rounded animate-pulse" />
            <div className="h-10 bg-muted/40 rounded animate-pulse" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="paypalEmail" className="text-sm font-semibold text-foreground">
                PayPal Receiving Email Address <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Enter the email address associated with your PayPal account where you want to receive client payments.
              </p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="paypalEmail"
                  type="email"
                  value={paypalEmail}
                  onChange={e => {
                    setPaypalEmail(e.target.value);
                    setEmailError(null);
                  }}
                  placeholder="your-paypal@business.com"
                  className={`pl-9 border-border text-sm ${emailError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  required
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Current saved account display */}
            {settings?.paypalEmail && (
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Currently Saved Account</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  {settings.paypalEmail}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={setSettings.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {setSettings.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
              ) : (
                <><Settings className="h-4 w-4 mr-2" />Save PayPal Account</>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
