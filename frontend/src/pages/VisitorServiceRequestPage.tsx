import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateVisitorRequest } from '../hooks/useServiceRequests';
import { ServiceType } from '../backend';

const serviceOptions = [
  { value: ServiceType.incomeTaxFiling, label: 'Income Tax Filing' },
  { value: ServiceType.corporateTaxFiling, label: 'Corporate Tax Filing' },
  { value: ServiceType.audits, label: 'Audits' },
  { value: ServiceType.payrollAdmin, label: 'Payroll Administration' },
  { value: ServiceType.ledgerMaintenance, label: 'Ledger Maintenance' },
  { value: ServiceType.bankReconciliation, label: 'Bank Reconciliation' },
  { value: ServiceType.other, label: 'Any Other Service' },
];

export default function VisitorServiceRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceType: '' as ServiceType | '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const createVisitorRequest = useCreateVisitorRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company || !formData.serviceType) return;

    try {
      await createVisitorRequest.mutateAsync({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        serviceType: formData.serviceType as ServiceType,
        description: formData.description,
        deadline: BigInt(Date.now()) * BigInt(1_000_000),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit request:', error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Request Submitted!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for reaching out. Our team will review your request and get back to you within 24 hours.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/">
              <Button className="w-full bg-navy text-white hover:bg-navy/90">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Your Company Ltd."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">
              Service Required <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => setFormData({ ...formData, serviceType: value as ServiceType })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please describe your requirements in detail..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold"
            disabled={createVisitorRequest.isPending || !formData.name || !formData.email || !formData.company || !formData.serviceType}
          >
            {createVisitorRequest.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>

          {createVisitorRequest.isError && (
            <p className="text-destructive text-sm text-center">
              Failed to submit request. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
