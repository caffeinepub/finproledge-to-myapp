import { Link } from '@tanstack/react-router';
import { SiX, SiInstagram, SiLinkedin } from 'react-icons/si';
import {
  Shield,
  TrendingUp,
  FileText,
  Calculator,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Award,
  Users,
  Clock,
  Star,
  ChevronRight,
  Briefcase,
  BookOpen,
  PieChart,
  CreditCard,
} from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: 'Income Tax Filing',
    description: 'Comprehensive individual and corporate income tax preparation and filing services.',
  },
  {
    icon: Calculator,
    title: 'GST Filing',
    description: 'End-to-end GST compliance, return filing, and reconciliation for businesses of all sizes.',
  },
  {
    icon: BarChart3,
    title: 'TDS Filing',
    description: 'Accurate TDS computation, deduction, and timely filing to ensure full statutory compliance.',
  },
  {
    icon: Shield,
    title: 'Audits & Assurance',
    description: 'Rigorous internal and statutory audits to maintain the highest standards of fiscal health.',
  },
  {
    icon: PieChart,
    title: 'Financial Management',
    description: 'Strategic financial planning, budgeting, and treasury management for sustainable growth.',
  },
  {
    icon: BookOpen,
    title: 'Accounting Services',
    description: 'Full-cycle bookkeeping and precise financial statements in accordance with global standards.',
  },
  {
    icon: Users,
    title: 'Payroll Administration',
    description: 'Complete payroll processing, compliance, and employee benefits management.',
  },
  {
    icon: CreditCard,
    title: 'Loan Financing',
    description: 'Expert guidance on loan structuring, documentation, and financing solutions for your business.',
  },
  {
    icon: Briefcase,
    title: 'Corporate Tax Filing',
    description: 'Strategic corporate tax planning and filing to minimize liability and ensure compliance.',
  },
];

const stats = [
  { value: '30+', label: 'Years of Excellence', icon: Award },
  { value: '500+', label: 'Clients Served', icon: Users },
  { value: '99.8%', label: 'Filing Accuracy', icon: CheckCircle },
  { value: '24/7', label: 'Client Support', icon: Clock },
];

const principles = [
  {
    title: 'Technical Precision',
    description: 'Every entry, every filing, every report — executed with meticulous attention to detail and zero tolerance for error.',
    icon: CheckCircle,
  },
  {
    title: 'Operational Reliability',
    description: 'Deadlines are non-negotiable. We build systems and processes that ensure punctual delivery, every time.',
    icon: Clock,
  },
  {
    title: 'Confidential Integrity',
    description: 'Your financial data is handled with the highest standards of security, discretion, and professional ethics.',
    icon: Shield,
  },
  {
    title: 'Results Over Rhetoric',
    description: 'We channel our energy into the delivery of meticulous, high-volume financial practice — not public speaking.',
    icon: TrendingUp,
  },
];

const testimonials = [
  {
    name: 'Rajesh Mehta',
    company: 'Mehta Industries Pvt. Ltd.',
    text: 'FinPro Ledge has transformed our financial operations. Their GST and TDS filing accuracy is unmatched, and they always meet every deadline.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    company: 'Sharma & Associates',
    text: 'The level of technical expertise and attention to detail is extraordinary. Our audits have never been cleaner.',
    rating: 5,
  },
  {
    name: 'Anil Kapoor',
    company: 'Kapoor Exports Ltd.',
    text: 'From payroll to corporate tax filing, FinPro Ledge handles everything with precision. They are truly an extension of our finance team.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x800.png)' }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-gold/20" />
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-2 mb-8">
                <Star className="w-4 h-4 text-gold" fill="currentColor" />
                <span className="text-gold text-sm font-medium tracking-wide">Trusted Financial Services Since 1994</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                The Engine of Your{' '}
                <span className="text-gold">Financial</span>{' '}
                Operations
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-xl">
                We operate in the trenches of your financial data — ensuring every entry is accurate, every filing is punctual, and every obligation is met with precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-4 rounded-sm transition-all duration-200 text-lg shadow-lg shadow-gold/25"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about-us"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-gold/60 text-white hover:text-gold font-semibold px-8 py-4 rounded-sm transition-all duration-200 text-lg"
                >
                  About Us
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm p-6 hover:bg-white/15 transition-all duration-200"
                  >
                    <Icon className="w-8 h-8 text-gold mb-3" />
                    <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/70 text-sm font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">Our Services</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Core Financial Competencies
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive financial services delivered with technical excellence and operational reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group bg-card border border-border rounded-sm p-6 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-primary group-hover:text-gold transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-sm transition-all duration-200"
            >
              Request a Service
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Image Banner */}
      <section className="relative h-80 overflow-hidden">
        <img
          src="/assets/generated/hero-accounting.dim_1440x600.png"
          alt="Financial Operations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white max-w-xl leading-tight">
              Precision in Every{' '}
              <span className="text-gold">Financial</span>{' '}
              Transaction
            </h2>
            <p className="text-white/80 mt-4 max-w-md text-lg">
              From GST filings to complex audits — we handle the mechanics so you can focus on growth.
            </p>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-semibold tracking-wide uppercase">Our Principles</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Built for Clients Who Value Results
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We are built for the client who values results over rhetoric. Our energy is strictly channeled into the delivery of meticulous, high-volume financial practice.
              </p>
              <Link
                to="/about-us"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-gold transition-colors duration-200"
              >
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={principle.title}
                    className="flex gap-4 bg-card border border-border rounded-sm p-5 hover:border-gold/30 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{principle.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{principle.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">Client Testimonials</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Trusted by businesses across India for rigorous financial services.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-card border border-border rounded-sm p-6 hover:border-gold/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold" fill="currentColor" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="border-t border-border pt-4">
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="text-muted-foreground text-sm">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-primary/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Streamline Your{' '}
            <span className="text-gold">Financial Operations?</span>
          </h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            Partner with FinPro Ledge — a dedicated extension of your finance department that prioritizes technical excellence above all else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-navy font-bold px-10 py-4 rounded-sm transition-all duration-200 text-lg shadow-lg shadow-gold/25"
            >
              Contact Us Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about-us"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-gold/60 text-white hover:text-gold font-semibold px-10 py-4 rounded-sm transition-all duration-200 text-lg"
            >
              Learn More
            </Link>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <span className="text-white/50 text-sm">Follow us:</span>
            <a
              href="https://x.com/FinproLedge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors duration-200"
            >
              <SiX className="w-5 h-5" />
              <span className="text-sm">@finproledge</span>
            </a>
            <a
              href="https://www.instagram.com/finproledge/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors duration-200"
            >
              <SiInstagram className="w-5 h-5" />
              <span className="text-sm">@finproledge</span>
            </a>
            <a
              href="https://www.linkedin.com/in/finproledge/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors duration-200"
            >
              <SiLinkedin className="w-5 h-5" />
              <span className="text-sm">FinPro Ledge</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
