import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  FileText,
  Calculator,
  TrendingUp,
  Shield,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Star,
  Building2,
  BarChart3,
  Briefcase,
  CreditCard,
  BookOpen,
  PiggyBank,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  {
    icon: FileText,
    title: 'Income Tax Filing',
    description: 'Expert assistance with individual and corporate income tax returns.',
    detail: 'We handle everything from computation to filing, ensuring maximum deductions and full compliance with the latest tax laws. Our team stays updated with every amendment to protect your interests.',
    href: '/service-booking',
  },
  {
    icon: Building2,
    title: 'Corporate Tax Filing',
    description: 'Comprehensive corporate tax planning and compliance services.',
    detail: 'From advance tax calculations to final return filing, we manage your corporate tax obligations end-to-end, minimizing liability while ensuring timely compliance with all statutory requirements.',
    href: '/service-booking',
  },
  {
    icon: BarChart3,
    title: 'GST Filing',
    description: 'Complete GST registration, return filing, and reconciliation.',
    detail: 'Our GST experts handle GSTR-1, GSTR-3B, annual returns, and reconciliation to keep your business fully compliant, avoid penalties, and optimize your input tax credit claims.',
    href: '/service-booking',
  },
  {
    icon: Calculator,
    title: 'TDS Filing',
    description: 'Accurate TDS computation, deduction, and timely return filing.',
    detail: 'We ensure correct TDS deductions at source, timely deposit to the government, and accurate filing of quarterly returns to help you avoid interest charges and penalties.',
    href: '/service-booking',
  },
  {
    icon: Shield,
    title: 'Audits',
    description: 'Thorough statutory, internal, and tax audits by experienced professionals.',
    detail: 'Our audit team conducts comprehensive reviews of your financial statements and internal controls, providing detailed reports that enhance transparency and build stakeholder confidence.',
    href: '/service-booking',
  },
  {
    icon: Users,
    title: 'Payroll Administration',
    description: 'Complete payroll processing with PF, ESI, and statutory compliance.',
    detail: 'From salary computation and payslip generation to PF/ESI filings and professional tax compliance, we manage your entire payroll cycle so you can focus on growing your business.',
    href: '/service-booking',
  },
  {
    icon: BookOpen,
    title: 'Ledger Maintenance',
    description: 'Systematic recording and maintenance of financial ledgers.',
    detail: 'We maintain accurate and up-to-date ledgers for all your accounts, providing a clear financial picture that supports informed decision-making and simplifies year-end audits.',
    href: '/service-booking',
  },
  {
    icon: CreditCard,
    title: 'Bank Reconciliation',
    description: 'Regular reconciliation of bank statements with your books.',
    detail: 'Our reconciliation services detect discrepancies early, prevent fraud, and ensure your cash flow records are always accurate and aligned with your bank statements.',
    href: '/service-booking',
  },
  {
    icon: TrendingUp,
    title: 'Financial Management',
    description: 'Strategic financial planning, budgeting, and advisory services.',
    detail: 'We provide comprehensive financial management including cash flow planning, budget preparation, MIS reporting, and strategic advisory to help your business achieve sustainable growth.',
    href: '/service-booking',
  },
  {
    icon: Briefcase,
    title: 'Accounting Services',
    description: 'Full-spectrum bookkeeping and accounting for businesses of all sizes.',
    detail: 'Our accounting team handles day-to-day bookkeeping, preparation of financial statements, and management accounts, ensuring your records are always audit-ready and compliant.',
    href: '/service-booking',
  },
  {
    icon: PiggyBank,
    title: 'Loan Financing',
    description: 'Expert assistance with loan applications and financial structuring.',
    detail: 'We help you prepare compelling loan proposals, organize financial documentation, and navigate the lending process to secure the best financing options for your business or personal needs.',
    href: '/service-booking',
  },
];

const principles = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We uphold the highest ethical standards in every engagement, ensuring complete transparency and honesty with our clients.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Our team of qualified professionals delivers work of the highest quality, staying current with all regulatory changes.',
  },
  {
    icon: Users,
    title: 'Client Focus',
    description: 'We build long-term relationships by understanding each client\'s unique needs and delivering tailored solutions.',
  },
  {
    icon: CheckCircle,
    title: 'Compliance',
    description: 'We ensure all filings and submissions are accurate, complete, and submitted well within statutory deadlines.',
  },
];

const testimonials = [
  {
    name: 'Rajesh Sharma',
    company: 'Sharma Enterprises',
    text: 'FinProLedge has been managing our accounts and GST filings for over 5 years. Their attention to detail and proactive approach has saved us significant tax liability.',
    rating: 5,
  },
  {
    name: 'Priya Mehta',
    company: 'Mehta & Associates',
    text: 'The payroll management service is exceptional. They handle everything seamlessly and we have never missed a compliance deadline since partnering with them.',
    rating: 5,
  },
  {
    name: 'Amit Gupta',
    company: 'Gupta Industries',
    text: 'Their audit team is thorough and professional. The detailed reports they provide have helped us strengthen our internal controls significantly.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden bg-navy">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x800.png)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-gold text-sm font-medium">Trusted Since 1994</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Trusted Partner in{' '}
              <span className="text-gold">Financial Excellence</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-2xl">
              Comprehensive accounting, tax, and financial management services delivered with
              precision, integrity, and deep expertise. We help businesses and individuals navigate
              complex financial landscapes with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8"
              >
                <Link to="/service-booking">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gold py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '30+', label: 'Years of Experience' },
              { value: '500+', label: 'Happy Clients' },
              { value: '10,000+', label: 'Returns Filed' },
              { value: '100%', label: 'Compliance Rate' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-navy">{stat.value}</div>
                <div className="text-navy/70 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our <span className="text-gold">Services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A comprehensive suite of financial and accounting services tailored to meet the needs
              of businesses and individuals across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group hover:shadow-lg transition-all duration-300 border-border hover:border-gold/40 bg-card"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-gold/10 rounded-lg shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Icon className="h-6 w-6 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-gold transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 font-medium">
                          {service.description}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {service.detail}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <Link
                        to={service.href}
                        className="flex items-center gap-1 text-sm text-gold hover:text-gold/80 font-medium transition-colors"
                      >
                        Request Service <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="text-gold">Principles</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The values that guide every engagement and define our commitment to our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <div
                  key={principle.title}
                  className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors"
                >
                  <div className="inline-flex p-3 bg-gold/20 rounded-full mb-4">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{principle.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{principle.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our <span className="text-gold">Clients Say</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-muted-foreground text-xs">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Simplify Your Financial Compliance?
          </h2>
          <p className="text-navy/70 mb-8 text-lg">
            Get in touch with our experts today and discover how we can help your business thrive.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              asChild
              size="lg"
              className="bg-navy hover:bg-navy/90 text-white font-semibold px-8"
            >
              <Link to="/service-booking">Book a Consultation</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-navy text-navy hover:bg-navy/10 px-8"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-navy/70 text-sm">
            <a href="tel:+918882101300" className="flex items-center gap-2 hover:text-navy transition-colors">
              <Phone className="h-4 w-4" />
              +91 8882101300
            </a>
            <a href="mailto:finproledge@gmail.com" className="flex items-center gap-2 hover:text-navy transition-colors">
              <Mail className="h-4 w-4" />
              finproledge@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
