import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceType } from '../backend';
import { useCreateVisitorRequest } from '../hooks/useServiceRequests';

const serviceTypeOptions = [
  { value: 'incomeTaxFiling', label: 'Income Tax Filing' },
  { value: 'corporateTaxFiling', label: 'Corporate Tax Filing' },
  { value: 'gstFiling', label: 'GST Filing' },
  { value: 'tdsFiling', label: 'TDS Filing' },
  { value: 'audits', label: 'Audits' },
  { value: 'payrollAdmin', label: 'Payroll Administration' },
  { value: 'ledgerMaintenance', label: 'Ledger Maintenance' },
  { value: 'bankReconciliation', label: 'Bank Reconciliation' },
  { value: 'financialManagement', label: 'Financial Management' },
  { value: 'accountingServices', label: 'Accounting Services' },
  { value: 'loanFinancing', label: 'Loan Financing' },
  { value: 'other', label: 'Other' },
];

export default function VisitorServiceRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceType: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const createVisitorRequest = useCreateVisitorRequest();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.serviceType) return;

    try {
      const deadline = BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000) * BigInt(1_000_000);
      await createVisitorRequest.mutateAsync({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        serviceType: formData.serviceType as ServiceType,
        description: formData.description,
        deadline,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit request:', error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for reaching out. Our team will contact you within 24 hours.
          </p>
          <Button asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Contact <span className="text-gold">Us</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Reach out to our team of financial experts. We're here to help you navigate your
            financial needs with precision and care.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Get in Touch</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Have a question or need assistance? Fill out the form and our team will get back
                  to you promptly.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg">
                      <Phone className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <a
                        href="tel:+918882101300"
                        className="text-sm font-medium text-foreground hover:text-gold transition-colors"
                      >
                        +91 8882101300
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg">
                      <Mail className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <a
                        href="mailto:finproledge@gmail.com"
                        className="text-sm font-medium text-foreground hover:text-gold transition-colors"
                      >
                        finproledge@gmail.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Location</div>
                      <div className="text-sm font-medium text-foreground">New Delhi, India</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg">
                      <Clock className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Business Hours</div>
                      <div className="text-sm font-medium text-foreground">
                        Mon–Sat: 9:00 AM – 6:00 PM
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-6">Service Request Form</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Your full name"
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
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company / Organization</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleChange('company', e.target.value)}
                          placeholder="Your company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceType">
                        Service Required <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.serviceType}
                        onValueChange={(value) => handleChange('serviceType', value)}
                      >
                        <SelectTrigger id="serviceType">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypeOptions.map((option) => (
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
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Please describe your requirements in detail..."
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={createVisitorRequest.isPending}
                      className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold"
                      size="lg"
                    >
                      {createVisitorRequest.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin h-4 w-4 border-2 border-navy border-t-transparent rounded-full" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Submit Request
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
