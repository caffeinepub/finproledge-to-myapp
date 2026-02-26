import { useState } from 'react';
import { ServiceType } from '../backend';
import { useCreateVisitorRequest } from '../hooks/useServiceRequests';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Mail, Building2, User } from 'lucide-react';

const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: ServiceType.incomeTaxFiling, label: 'Income Tax Filing' },
  { value: ServiceType.corporateTaxFiling, label: 'Corporate Tax Filing' },
  { value: ServiceType.audits, label: 'Audits & Assurance' },
  { value: ServiceType.payrollAdmin, label: 'Payroll Administration' },
  { value: ServiceType.ledgerMaintenance, label: 'Ledger Maintenance' },
  { value: ServiceType.bankReconciliation, label: 'Bank Reconciliation' },
  { value: ServiceType.gstFiling, label: 'GST Filing' },
  { value: ServiceType.tdsFiling, label: 'TDS Filing' },
  { value: ServiceType.financialManagement, label: 'Financial Management' },
  { value: ServiceType.accountingServices, label: 'Accounting Services' },
  { value: ServiceType.loanFinancing, label: 'Loan Financing' },
  { value: ServiceType.other, label: 'Other' },
];

export default function VisitorServiceRequestPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.incomeTaxFiling);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const createVisitorRequest = useCreateVisitorRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const deadlineNs = deadline
        ? BigInt(new Date(deadline).getTime()) * BigInt(1_000_000)
        : BigInt(Date.now()) * BigInt(1_000_000);

      await createVisitorRequest.mutateAsync({
        name,
        email,
        company,
        phone,
        serviceType,
        description,
        deadline: deadlineNs,
      });
      setSubmitted(true);
      toast.success('Your enquiry has been submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Thank You!</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Your enquiry has been received. Our team will get back to you within 24 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Submit Another Enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Contact <span className="text-gold">Us</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Tell us about your financial service needs and we'll get back to you promptly.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-sm p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send Us an Enquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company / Organization</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your company name"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">
                  Service Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={serviceType}
                  onValueChange={(val) => setServiceType(val as ServiceType)}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your requirements in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Preferred Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <Button
                type="submit"
                disabled={createVisitorRequest.isPending}
                className="w-full"
                size="lg"
              >
                {createVisitorRequest.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Enquiry'
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
