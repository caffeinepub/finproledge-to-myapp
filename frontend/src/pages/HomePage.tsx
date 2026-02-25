import { Link } from '@tanstack/react-router';
import { Shield, Award, Users, TrendingUp, CheckCircle, ArrowRight, Phone, Mail, MapPin, Star } from 'lucide-react';

const services = [
  {
    title: 'Income Tax Filing',
    description: 'Comprehensive personal and business income tax preparation and filing services.',
    icon: '📋',
  },
  {
    title: 'Corporate Tax Filing',
    description: 'Expert corporate tax compliance, planning, and optimization strategies.',
    icon: '🏢',
  },
  {
    title: 'Audits',
    description: 'Thorough financial audits ensuring accuracy, compliance, and transparency.',
    icon: '🔍',
  },
  {
    title: 'Payroll Administration',
    description: 'Complete payroll management including calculations, filings, and compliance.',
    icon: '💼',
  },
  {
    title: 'Ledger Maintenance',
    description: 'Accurate bookkeeping and ledger maintenance for clear financial records.',
    icon: '📊',
  },
  {
    title: 'Bank Reconciliation',
    description: 'Precise reconciliation services to ensure your accounts are always balanced.',
    icon: '🏦',
  },
];

const stats = [
  { value: '30+', label: 'Years of Experience' },
  { value: '500+', label: 'Clients Served' },
  { value: '99%', label: 'Client Satisfaction' },
  { value: '₹100Cr+', label: 'Tax Savings Delivered' },
];

const principles = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We uphold the highest ethical standards in every engagement.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Delivering superior quality work that exceeds expectations.',
  },
  {
    icon: Users,
    title: 'Client Focus',
    description: 'Your financial success is our primary mission and commitment.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description: 'Helping businesses and individuals achieve their financial goals.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x800.png)' }}
        />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6">
            <img
              src="/assets/generated/logo.dim_400x120.png"
              alt="FinProLedge"
              className="h-16 mx-auto mb-4 brightness-0 invert"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Precision Financial Services
            <span className="block text-gold mt-2">You Can Trust</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Delivering rigorous financial services with integrity and precision since 1994.
            Your trusted partner for tax, audit, and accounting excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/request-service"
              className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-8 py-3 rounded-sm hover:bg-gold/90 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/client-portal"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-8 py-3 rounded-sm hover:bg-white/10 transition-colors"
            >
              Client Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-gold py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-navy font-medium text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Chartered Accountants
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              ICAI Registered
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              30+ Years Experience
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              500+ Satisfied Clients
            </span>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Principles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on a foundation of trust, expertise, and unwavering commitment to your financial well-being.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle) => (
              <div key={principle.title} className="text-center p-6 rounded-sm border border-border hover:border-gold/50 transition-colors">
                <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <principle.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{principle.title}</h3>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive financial services tailored to meet your personal and business needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-card border border-border rounded-sm p-6 hover:border-gold/50 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/request-service"
              className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-8 py-3 rounded-sm hover:bg-navy/90 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rajesh Kumar',
                company: 'Kumar Industries',
                text: 'FinProLedge has been managing our corporate taxes for over 10 years. Their expertise and attention to detail is unmatched.',
              },
              {
                name: 'Priya Sharma',
                company: 'Sharma Enterprises',
                text: 'The team at FinProLedge helped us save significantly on our tax liability while ensuring full compliance. Highly recommended!',
              },
              {
                name: 'Amit Patel',
                company: 'Patel & Associates',
                text: 'Professional, reliable, and always available when we need them. Our go-to firm for all financial matters.',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-card border border-border rounded-sm p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                  <div className="text-muted-foreground text-xs">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gold/10 border-t border-gold/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ready to take control of your financial future? Our team of expert chartered accountants is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              to="/request-service"
              className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-8 py-3 rounded-sm hover:bg-gold/90 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/client-portal"
              className="inline-flex items-center gap-2 border-2 border-navy text-navy font-semibold px-8 py-3 rounded-sm hover:bg-navy/5 transition-colors"
            >
              Access Client Portal
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold" />
              +91 98765 43210
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold" />
              finproledge@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              Mumbai, Maharashtra
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
