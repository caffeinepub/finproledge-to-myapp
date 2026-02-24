import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ServiceRequestForm from '../components/ServiceRequestForm';
import { CheckCircle2 } from 'lucide-react';

export default function ServiceBookingPage() {
  return (
    <div className="py-12 bg-muted/30 min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Book a Service</h1>
            <p className="text-muted-foreground text-lg">
              Request our technical financial execution services. We'll review your requirements and get back to you promptly.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Service Request Form</CardTitle>
                  <CardDescription>
                    Fill out the form below to request a service. Our team will contact you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServiceRequestForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium mb-1">Review</div>
                      <div className="text-muted-foreground">We review your request within 24 hours</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium mb-1">Consultation</div>
                      <div className="text-muted-foreground">Schedule a call to discuss requirements</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium mb-1">Execution</div>
                      <div className="text-muted-foreground">We begin work with our zero-error protocol</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent">
                <CardHeader>
                  <CardTitle className="text-lg">Our Guarantee</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Every deliverable follows our Four-Eyes Review protocol and is completed at least 5 days before your deadline.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
