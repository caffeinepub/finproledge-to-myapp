import { useState } from 'react';
import { ServiceType } from '../backend';
import { useCreateRequest } from '../hooks/useServiceRequests';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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

export default function ServiceRequestForm() {
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.incomeTaxFiling);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const createRequest = useCreateRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadline) {
      toast.error('Please select a deadline');
      return;
    }
    try {
      const deadlineNs = BigInt(new Date(deadline).getTime()) * BigInt(1_000_000);
      await createRequest.mutateAsync({ serviceType, description, deadline: deadlineNs });
      toast.success('Service request submitted successfully!');
      setDescription('');
      setDeadline('');
      setServiceType(ServiceType.incomeTaxFiling);
    } catch (err) {
      toast.error('Failed to submit service request. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="serviceType">Service Type</Label>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your service requirements..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline</Label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <Button type="submit" disabled={createRequest.isPending} className="w-full">
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
