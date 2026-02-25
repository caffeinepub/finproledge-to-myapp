import { useState } from 'react';
import { useCreateRequest } from '../hooks/useServiceRequests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ServiceType } from '../backend';

export default function ServiceRequestForm() {
  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date>();
  const [phone, setPhone] = useState('');

  const createRequest = useCreateRequest();

  const serviceTypes = [
    { value: ServiceType.incomeTaxFiling, label: 'Income Tax Filing' },
    { value: ServiceType.corporateTaxFiling, label: 'Corporate Tax Filing' },
    { value: ServiceType.audits, label: 'Audits' },
    { value: ServiceType.payrollAdmin, label: 'Payroll Administration' },
    { value: ServiceType.ledgerMaintenance, label: 'Ledger Maintenance' },
    { value: ServiceType.bankReconciliation, label: 'Bank Reconciliation' },
    { value: ServiceType.other, label: 'Any Other Service' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceType || !deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const deadlineNanos = BigInt(deadline.getTime()) * BigInt(1_000_000);
      await createRequest.mutateAsync({
        serviceType: serviceType as ServiceType,
        description: description.trim(),
        deadline: deadlineNanos,
      });

      toast.success('Service request submitted successfully');
      setServiceType('');
      setDescription('');
      setDeadline(undefined);
      setPhone('');
    } catch (error) {
      toast.error('Failed to submit service request');
      console.error('Service request error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="space-y-2">
        <Label htmlFor="serviceType">Service Type</Label>
        <Select value={serviceType} onValueChange={(value) => setServiceType(value as ServiceType)}>
          <SelectTrigger id="serviceType">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your requirements in detail..."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label>Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deadline ? format(deadline, 'PPP') : <span>Pick a date</span>}
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

      <Button type="submit" className="w-full" disabled={createRequest.isPending}>
        {createRequest.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Request'
        )}
      </Button>
    </form>
  );
}
