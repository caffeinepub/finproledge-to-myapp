import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateRequest } from '../hooks/useServiceRequests';
import { ServiceType } from '../backend';
import { toast } from 'sonner';

const serviceOptions = [
  { value: ServiceType.incomeTaxFiling, label: 'Income Tax Filing' },
  { value: ServiceType.corporateTaxFiling, label: 'Corporate Tax Filing' },
  { value: ServiceType.audits, label: 'Audits' },
  { value: ServiceType.payrollAdmin, label: 'Payroll Administration' },
  { value: ServiceType.ledgerMaintenance, label: 'Ledger Maintenance' },
  { value: ServiceType.bankReconciliation, label: 'Bank Reconciliation' },
  { value: ServiceType.other, label: 'Any Other Service' },
];

export default function ServiceRequestForm() {
  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [description, setDescription] = useState('');

  const createRequest = useCreateRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType) return;

    try {
      await createRequest.mutateAsync({
        serviceType: serviceType as ServiceType,
        description,
        deadline: BigInt(Date.now()) * BigInt(1_000_000),
      });
      toast.success('Service request submitted successfully!');
      setServiceType('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="serviceType">
          Service Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={serviceType}
          onValueChange={(value) => setServiceType(value as ServiceType)}
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your requirements..."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold"
        disabled={createRequest.isPending || !serviceType}
      >
        {createRequest.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Request'
        )}
      </Button>
    </form>
  );
}
