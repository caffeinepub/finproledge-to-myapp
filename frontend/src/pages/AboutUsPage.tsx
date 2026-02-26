import { Shield, FileText, BarChart3, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const competencies = [
  {
    icon: FileText,
    title: 'Taxation & Statutory Filings',
    description:
      'Comprehensive management of direct and indirect tax obligations, from preparation to final submission.',
  },
  {
    icon: Shield,
    title: 'Assurance & Internal Audit',
    description:
      'Systematic verification of accounts and internal controls to maintain the highest standards of fiscal health.',
  },
  {
    icon: BarChart3,
    title: 'Accounting & Reporting',
    description:
      'Full-cycle bookkeeping and the generation of precise financial statements in accordance with global standards.',
  },
  {
    icon: Briefcase,
    title: 'Financial Administration',
    description:
      'Handling the daily complexities of payroll, accounts payable/receivable, and treasury management.',
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-primary/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium tracking-wide">Who We Are</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            What We Do:{' '}
            <span className="text-gold">The Engine of Your Financial Operations</span>
          </h1>
          <p className="text-white/80 text-xl leading-relaxed max-w-3xl mx-auto">
            We are a specialized Financial Services Enterprise dedicated to the rigorous technical work that keeps organizations running.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We don't just provide high-level summaries; we operate in the trenches of your financial data to ensure every entry is accurate and every filing is punctual.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our focus is entirely on the mechanics of finance. We have removed the noise of public consulting and general advisory to focus on what matters:{' '}
                <strong className="text-foreground">the work.</strong>
              </p>
            </div>
            <div className="bg-muted/40 border border-border rounded-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Our Focus</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Meticulous financial data management',
                  'Punctual statutory filings',
                  'High-volume financial practice',
                  'Technical excellence above all',
                  'Operational reliability',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">What We Offer</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Competencies</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four pillars of financial excellence that form the foundation of everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {competencies.map((comp, index) => {
              const Icon = comp.icon;
              return (
                <div
                  key={comp.title}
                  className="bg-card border border-border rounded-sm p-8 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                      <Icon className="w-7 h-7 text-gold" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-gold/60 tracking-widest uppercase">0{index + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{comp.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{comp.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Way We Work */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-2 mb-4">
                <CheckCircle className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-semibold tracking-wide uppercase">Our Approach</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">The Way We Work</h2>
              <div className="w-16 h-1 bg-gold rounded-full" />
            </div>
            <div className="lg:col-span-3">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We are built for the client who values results over rhetoric. We do not spend our time on the public speaking circuit or hosting seminars. Instead, our energy is strictly channeled into the delivery of meticulous, high-volume financial practice.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                When you partner with us, you are hiring a dedicated extension of your finance department — one that prioritizes{' '}
                <strong className="text-foreground">technical excellence</strong> and{' '}
                <strong className="text-foreground">operational reliability</strong> above all else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-primary/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Partner with Us?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Let us become a dedicated extension of your finance department.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-navy font-bold px-10 py-4 rounded-sm transition-all duration-200 text-lg shadow-lg shadow-gold/25"
          >
            Contact Us Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
