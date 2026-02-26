import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  FileText,
  BarChart2,
  Shield,
  Users,
  TrendingUp,
  BookOpen,
  DollarSign,
  Briefcase,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
} from 'lucide-react';
import { SiLinkedin, SiX, SiFacebook } from 'react-icons/si';
import { Button } from '@/components/ui/button';

const SERVICES = [
  {
    icon: FileText,
    title: 'Income Tax Filing',
    description:
      'Accurate and timely income tax returns for individuals and businesses, ensuring full compliance with the latest regulations.',
  },
  {
    icon: BarChart2,
    title: 'Corporate Tax Filing',
    description:
      'Comprehensive corporate tax solutions tailored to minimize liability while maintaining strict regulatory compliance.',
  },
  {
    icon: Shield,
    title: 'Audits',
    description:
      'Thorough statutory and internal audits conducted with precision, providing assurance and identifying areas for improvement.',
  },
  {
    icon: Users,
    title: 'Payroll Administration',
    description:
      'End-to-end payroll management including salary processing, PF, ESI, and all statutory deductions handled seamlessly.',
  },
  {
    icon: BookOpen,
    title: 'Ledger Maintenance',
    description:
      'Meticulous bookkeeping and ledger maintenance ensuring your financial records are always accurate and audit-ready.',
  },
  {
    icon: TrendingUp,
    title: 'Bank Reconciliation',
    description:
      'Regular bank reconciliation services to ensure your books match your bank statements and discrepancies are resolved promptly.',
  },
  {
    icon: DollarSign,
    title: 'GST Filing',
    description:
      'Complete GST compliance including registration, return filing, and advisory services to keep your business GST-compliant.',
  },
  {
    icon: Briefcase,
    title: 'Financial Management',
    description:
      'Strategic financial planning and management services to help your business grow sustainably and profitably.',
  },
  {
    icon: CreditCard,
    title: 'Loan Financing',
    description:
      'Expert guidance on loan structuring, documentation, and financing solutions tailored to your business needs.',
  },
];

const PRINCIPLES = [
  {
    title: 'Integrity First',
    description:
      'Every engagement is conducted with unwavering ethical standards and complete transparency.',
  },
  {
    title: 'Precision & Accuracy',
    description:
      'We apply rigorous attention to detail in every filing, report, and financial statement we produce.',
  },
  {
    title: 'Client-Centric',
    description:
      'Your financial goals drive our approach — we tailor every solution to your unique circumstances.',
  },
  {
    title: 'Continuous Learning',
    description:
      'Our team stays ahead of regulatory changes to provide you with the most current and compliant advice.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh Mehta',
    company: 'Mehta Enterprises',
    text: 'FinProLedge has been our trusted accounting partner for over 8 years. Their attention to detail and proactive approach to tax planning has saved us significantly.',
  },
  {
    name: 'Priya Sharma',
    company: 'Sharma & Associates',
    text: 'The team at FinProLedge handled our GST transition seamlessly. Their expertise and responsiveness are unmatched in the industry.',
  },
  {
    name: 'Anil Kumar',
    company: 'Kumar Industries',
    text: 'From payroll to audits, FinProLedge manages all our financial compliance needs with exceptional professionalism and accuracy.',
  },
];

// Stats — "99.8% filling accuracy" and "client support 24/7" removed
const STATS = [
  { value: '30+', label: 'Years of Experience' },
  { value: '500+', label: 'Clients Served' },
  { value: '₹50Cr+', label: 'Tax Savings Delivered' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x800.png)' }}
        />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-gold text-sm font-medium">Chartered Accountants Since 1994</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Financial Clarity,{' '}
              <span className="text-gold">Delivered</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
              FinProLedge brings three decades of expertise in taxation, auditing, and financial
              management to help businesses and individuals achieve compliance and growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/service-booking">
                <Button
                  size="lg"
                  className="bg-gold text-navy hover:bg-gold/90 font-semibold px-8 gap-2"
                >
                  Book a Consultation
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 hover:text-white px-8"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-navy py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">{stat.value}</div>
                <div className="text-white/70 text-sm font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive financial and compliance services tailored to meet the needs of
              businesses and individuals across India.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-gold/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">The Way We Work</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core principles guide every client engagement and define the FinProLedge standard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRINCIPLES.map((principle, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-card border border-border text-center hover:border-gold/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{principle.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trusted by hundreds of businesses and individuals across India for over three decades.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-card border border-border hover:border-gold/40 transition-colors"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-gold text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Simplify Your Finances?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Let FinProLedge handle your compliance and financial management so you can focus on
            growing your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/service-booking">
              <Button
                size="lg"
                className="bg-gold text-navy hover:bg-gold/90 font-semibold px-8 gap-2"
              >
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 hover:text-white px-8"
              >
                Contact Us
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Phone className="h-4 w-4 text-gold" />
              <span>+91 123-456-7890</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Mail className="h-4 w-4 text-gold" />
              <span>info@finlogic.co.in</span>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold/20 transition-colors"
            >
              <SiLinkedin className="h-4 w-4 text-white" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold/20 transition-colors"
            >
              <SiX className="h-4 w-4 text-white" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold/20 transition-colors"
            >
              <SiFacebook className="h-4 w-4 text-white" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
