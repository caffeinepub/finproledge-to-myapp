import React from 'react';
import { Link } from '@tanstack/react-router';
import { Shield, BookOpen, BarChart3, Users, ArrowRight, CheckCircle, Award, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: BookOpen,
    title: 'Tax Operations',
    description: 'Comprehensive income and corporate tax filing with full regulatory compliance and strategic planning.',
  },
  {
    icon: BarChart3,
    title: 'Ledger Integrity',
    description: 'Meticulous bookkeeping, ledger maintenance, and bank reconciliation to ensure accurate financial records.',
  },
  {
    icon: Shield,
    title: 'Internal Assurance',
    description: 'Independent audit services providing objective assessment of financial statements and internal controls.',
  },
  {
    icon: Users,
    title: 'Payroll Administration',
    description: 'End-to-end payroll processing, compliance management, and employee remuneration reporting.',
  },
];

const stats = [
  { value: '30+', label: 'Years of Experience' },
  { value: '500+', label: 'Clients Served' },
  { value: '99.8%', label: 'Filing Accuracy' },
  { value: '100%', label: 'Compliance Rate' },
];

const principles = [
  { icon: Award, title: 'Integrity', desc: 'Unwavering commitment to ethical standards in every engagement.' },
  { icon: CheckCircle, title: 'Accuracy', desc: 'Precision-driven processes ensuring error-free financial reporting.' },
  { icon: Clock, title: 'Compliance', desc: 'Proactive adherence to all regulatory and statutory requirements.' },
];

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section — two-column layout: text left, image right */}
      <section className="bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-stretch min-h-[420px]">
            {/* Text column */}
            <div className="flex-1 flex flex-col justify-center py-16 sm:py-20 lg:pr-12">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight mb-6">
                Trusted Financial<br />Stewardship
              </h1>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                FINPROLEDGE delivers rigorous accounting, tax, and audit services grounded in integrity, precision, and a deep commitment to your financial wellbeing.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/visitor-request">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-2.5 text-sm">
                    Engage Our Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/portal">
                  <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white px-6 py-2.5 text-sm">
                    Client Portal
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image column */}
            <div className="hidden lg:block lg:w-[520px] xl:w-[600px] flex-shrink-0 relative">
              <img
                src="/assets/generated/hero-accounting.dim_1440x600.png"
                alt="Professional accounting services"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Subtle left-edge fade so image blends into the primary background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 30+ Years Trust Banner */}
      <section className="bg-primary border-b border-primary/30 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/20 rounded-full">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-white leading-none">30+ Years</p>
                <p className="text-white/70 text-xs uppercase tracking-widest font-medium mt-0.5">of Professional Experience</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/20" />
            <p className="text-white/70 text-sm max-w-md">
              Three decades of trusted financial stewardship, serving businesses and individuals with unwavering commitment to accuracy and compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Principles Banner */}
      <section className="bg-accent/10 border-y border-accent/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {principles.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="p-2 bg-accent/20 rounded mt-0.5">
                  <Icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-2">Our Practice Areas</p>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Professional Services</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Comprehensive financial services delivered with the highest standards of professional conduct and technical expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary group-hover:text-accent-foreground transition-colors" />
                </div>
                <h3 className="text-sm font-serif font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-serif font-bold text-accent mb-1">{value}</p>
                <p className="text-xs text-white/70 uppercase tracking-wider font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">Begin Your Engagement</p>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Join Us as a Client Today</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-lg mx-auto">
            Submit a service request today and our team will be in touch to discuss your financial requirements and how we can best serve you.
          </p>
          <Link to="/visitor-request">
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 text-sm">
              Submit a Service Request
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
