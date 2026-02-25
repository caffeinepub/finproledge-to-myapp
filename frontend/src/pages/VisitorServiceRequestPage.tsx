import { useState } from 'react';
import { useCreateVisitorRequest } from '../hooks/useServiceRequests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, CheckCircle, Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ServiceType } from '../backend';

const SERVICE_TYPES = [
  { value: ServiceType.incomeTaxFiling, label: 'Income Tax Filing' },
  { value: ServiceType.corporateTaxFiling, label: 'Corporate Tax Filing' },
  { value: ServiceType.audits, label: 'Audits' },
  { value: ServiceType.payrollAdmin, label: 'Payroll Administration' },
  { value: ServiceType.ledgerMaintenance, label: 'Ledger Maintenance' },
  { value: ServiceType.bankReconciliation, label: 'Bank Reconciliation' },
  { value: ServiceType.other, label: 'Any Other Service' },
];

export default function VisitorServiceRequestPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date>();
  const [submitted, setSubmitted] = useState(false);

  const createVisitorRequest = useCreateVisitorRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !company.trim() || !serviceType || !deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const deadlineNanos = BigInt(deadline.getTime()) * BigInt(1_000_000);
      await createVisitorRequest.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        phone: phone.trim(),
        serviceType: serviceType as ServiceType,
        description: description.trim(),
        deadline: deadlineNanos,
      });

      setSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit your request. Please try again.');
      console.error('Visitor request error:', error);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setCompany('');
    setPhone('');
    setServiceType('');
    setDescription('');
    setDeadline(undefined);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-12 pb-10">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">Request Submitted!</h2>
              <p className="text-muted-foreground mb-2">
                Thank you for reaching out. Your service request has been received.
              </p>
              <p className="text-muted-foreground mb-8">
                Our team will review your request and get back to you at <strong>{email}</strong> shortly.
              </p>
              <Button onClick={handleReset} variant="outline">
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-2xl">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Service Request</h1>
          <p className="text-muted-foreground text-lg">
            Tell us about your financial service needs and we'll get back to you promptly.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Submit a Request
            </CardTitle>
            <CardDescription>
              No account required. Fill in your details and we'll be in touch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">
                  Your Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Organisation <span className="text-destructive">*</span></Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your company name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone No.</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">
                  Service Details
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type <span className="text-destructive">*</span></Label>
                  <Select value={serviceType} onValueChange={(value) => setServiceType(value as ServiceType)}>
                    <SelectTrigger id="serviceType">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your requirements in detail — the more context you provide, the better we can assist you."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Deadline <span className="text-destructive">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, 'PPP') : <span className="text-muted-foreground">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createVisitorRequest.isPending}
              >
                {createVisitorRequest.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
