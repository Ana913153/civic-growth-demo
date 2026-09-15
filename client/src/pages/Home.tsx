import { FormEvent, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, BarChart3, Check, ChevronDown, Database, LockKeyhole, Mail, Menu, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const formatNumber = new Intl.NumberFormat("en-US");

export default function Home() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overview = trpc.public.overview.useQuery();
  const subscribe = trpc.public.subscribe.useMutation({
    onSuccess: () => {
      setEmail("");
      setConsent(false);
      toast.success("You’re on the list", { description: "We’ll send occasional updates from Northstar Growth." });
    },
    onError: (error) => toast.error("Couldn’t save your email", { description: error.message }),
  });

  const metrics = overview.data?.metrics ?? [
    { year: "2026", balance: 1000, change: 1000, label: "Opening illustration" },
    { year: "2030", balance: 4600, change: 3600, label: "Time + contributions" },
    { year: "2040", balance: 17100, change: 12500, label: "Long-range projection" },
    { year: "2050", balance: 51200, change: 34100, label: "Illustrative horizon" },
  ];
  const maxBalance = useMemo(() => Math.max(...metrics.map((metric) => metric.balance)), [metrics]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      toast.error("Please confirm the email consent checkbox first.");
      return;
    }
    subscribe.mutate({ email, consent: true, source: "homepage" });
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f7f3] text-[#102d45]">
      <div className="demo-ribbon">FICTIONAL DEMO · NOT A GOVERNMENT WEBSITE · SYNTHETIC DATA ONLY</div>
      <header className="relative z-20 border-b border-[#d7dfdb] bg-[#f6f7f3]/95 backdrop-blur">
        <div className="container flex h-[78px] items-center justify-between">
          <a href="#top" className="brand-lockup" aria-label="Northstar Growth home">
            <span className="brand-mark"><Sparkles size={17} strokeWidth={2.5} /></span>
            <span>
              <span className="brand-name">NORTHSTAR</span>
              <span className="brand-subtitle">GROWTH PROGRAM</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#486073] md:flex" aria-label="Main navigation">
            <a href="#why">Why it matters</a>
            <a href="#projection">Projection</a>
            <a href="#answers">Answers</a>
            <Link href="/admin" className="nav-admin">Admin preview <ArrowUpRight size={14} /></Link>
          </nav>
          <button className="rounded-full p-2 md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
            <Menu size={22} />
          </button>
        </div>
        {menuOpen && <div className="container flex flex-col gap-4 border-t border-[#d7dfdb] py-5 text-sm font-semibold md:hidden"><a href="#why" onClick={() => setMenuOpen(false)}>Why it matters</a><a href="#projection" onClick={() => setMenuOpen(false)}>Projection</a><Link href="/admin">Admin preview</Link></div>}
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy reveal-up">
              <p className="eyebrow"><span className="eyebrow-dot" /> A clearer way to plan ahead</p>
              <h1>The future starts with a <em>small, steady</em> step.</h1>
              <p className="hero-lede">Northstar Growth is a fictional public information experience about long-term opportunity, thoughtful saving, and the power of time.</p>
              <div className="hero-actions">
                <a href="#join" className="primary-button">Get occasional updates <ArrowUpRight size={16} /></a>
                <a href="#projection" className="text-button">Explore the illustration <ChevronDown size={16} /></a>
              </div>
              <div className="trust-line"><ShieldCheck size={17} /> Privacy-first. Consent-based. No financial accounts connected.</div>
            </div>
            <div className="hero-art reveal-up delay-1" aria-label="Decorative illustration of an abstract north star">
              <div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="orbital orbital-three" />
              <div className="star-core"><Sparkles size={44} strokeWidth={1.3} /></div>
              <div className="art-caption"><span>01</span><span>LONG-TERM THINKING</span></div>
            </div>
          </div>
          <div className="hero-ticker"><div className="container ticker-inner"><span>Northstar / A fictional initiative</span><span>Illustration range 2026—2050</span><span>Built for clarity, not certainty</span></div></div>
        </section>

        <section id="why" className="section-light">
          <div className="container intro-grid">
            <div><p className="eyebrow">THE BIG PICTURE</p><h2>Big outcomes are often built from <em>small habits.</em></h2></div>
            <div className="intro-text"><p>We made this demo to show how a public-facing program can explain a long-term idea without asking people to hand over sensitive account details.</p><p>Follow the story, see the synthetic numbers, and subscribe only if you want future updates.</p></div>
          </div>
          <div className="container feature-grid">
            <article className="feature-card"><div className="feature-icon"><TrendingUp size={22} /></div><span className="card-number">01</span><h3>Start early</h3><p>Time can give consistent contributions more room to compound, even when the first step feels modest.</p></article>
            <article className="feature-card featured-card"><div className="feature-icon"><BarChart3 size={22} /></div><span className="card-number">02</span><h3>See the shape</h3><p>Clear visuals help people understand the difference between a starting point and a long-range illustration.</p></article>
            <article className="feature-card"><div className="feature-icon"><LockKeyhole size={22} /></div><span className="card-number">03</span><h3>Keep it private</h3><p>This demo stores only consented email signups. It never connects to, reads, or represents a real financial account.</p></article>
          </div>
        </section>

        <section id="projection" className="projection-section">
          <div className="container">
            <div className="section-heading-row"><div><p className="eyebrow eyebrow-dark">A SIMPLE ILLUSTRATION</p><h2>Let the idea <em>grow</em> with you.</h2></div><div className="section-aside"><span className="aside-label">Scenario range</span><strong>2026 — 2050</strong><span>Not a promise. Not financial advice.</span></div></div>
            <div className="chart-shell">
              <div className="chart-header"><div><span className="chart-label">Illustrative balance</span><strong>$51,200</strong></div><div className="chart-meta"><span className="legend-dot" /> Synthetic data</div></div>
              <div className="chart-area">
                <div className="chart-y-axis"><span>$60k</span><span>$40k</span><span>$20k</span><span>$0</span></div>
                <div className="bars">{metrics.map((metric, index) => <div className="bar-group" key={metric.year}><div className="bar-value">${formatNumber.format(metric.balance)}</div><div className="bar" style={{ height: `${Math.max(8, (metric.balance / maxBalance) * 100)}%`, animationDelay: `${index * 90}ms` }}><span /></div><span className="bar-year">{metric.year}</span></div>)}</div>
              </div>
              <div className="chart-footnote"><span>Opening illustration: $1,000</span><span>Scenario uses synthetic values for product demonstration only.</span></div>
            </div>
            <div className="projection-cards"><div><span>Without contributions</span><strong>$15,000</strong><small>Illustrative only</small></div><div className="projection-card-accent"><span>With a steady habit</span><strong>$51,200</strong><small>Illustrative only</small></div><div><span>With higher contributions</span><strong>$124,000</strong><small>Illustrative only</small></div></div>
          </div>
        </section>

        <section id="join" className="join-section"><div className="container join-grid"><div><p className="eyebrow eyebrow-dark">STAY IN THE LOOP</p><h2>Bring the next chapter <em>closer.</em></h2><p className="join-copy">Get occasional notes about this fictional demo and the ideas behind it. No spam, no account access, and one-click unsubscribe.</p></div><form className="signup-card" onSubmit={handleSubmit}><div className="input-label"><Mail size={17} /> Email address</div><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required aria-label="Email address" /><label className="consent-row"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree to receive Northstar Growth updates and understand this is a fictional demo.</span></label><button className="primary-button full-width" type="submit" disabled={subscribe.isPending}>{subscribe.isPending ? "Saving…" : "Sign me up"}<ArrowUpRight size={16} /></button><p className="form-note">Your email is used only for this demo’s update list and can be removed on request.</p></form></div></section>

        <section id="answers" className="section-light answers-section"><div className="container answers-grid"><div><p className="eyebrow">ANSWERS</p><h2>Clear by design.</h2></div><div className="answers-list"><details open><summary>Is this a government or financial service?</summary><p>No. Northstar Growth is a fictional demonstration site. It is not affiliated with a government, bank, fund, or public official.</p></details><details><summary>Are the numbers real?</summary><p>No. Every balance, count, and projection on this page is synthetic sample data created to demonstrate the interface.</p></details><details><summary>What happens after I subscribe?</summary><p>Your consented email is stored for the project owner’s admin preview. You can request removal at any time.</p></details></div></div></section>
      </main>
      <footer className="footer"><div className="container footer-inner"><div className="brand-lockup"><span className="brand-mark"><Sparkles size={17} /></span><span><span className="brand-name">NORTHSTAR</span><span className="brand-subtitle">FICTIONAL DEMO</span></span></div><p>© 2026 Northstar Growth. Demo only. No government affiliation.</p><Link href="/admin" className="footer-admin">Admin preview <ArrowUpRight size={14} /></Link></div></footer>
    </div>
  );
}
