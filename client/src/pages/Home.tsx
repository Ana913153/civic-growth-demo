import { FormEvent, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, BarChart3, Check, ChevronDown, Database, LockKeyhole, Mail, Menu, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const formatNumber = new Intl.NumberFormat("en-US");

export default function Home() {
  const [email, set邮箱] = useState("");
  const [consent, setConsent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overview = trpc.public.overview.useQuery();
  const subscribe = trpc.public.subscribe.useMutation({
    onSuccess: () => {
      set邮箱("");
      setConsent(false);
      toast.success("订阅成功", { description: "我们会偶尔发送北辰成长计划的最新动态。" });
    },
    onError: (error) => toast.error("邮箱保存失败", { description: error.message }),
  });

  const metrics = overview.data?.metrics ?? [
    { year: "2026", balance: 1000, change: 1000, label: "初始示例" },
    { year: "2030", balance: 4600, change: 3600, label: "时间 + 持续投入" },
    { year: "2040", balance: 17100, change: 12500, label: "长期预测示例" },
    { year: "2050", balance: 51200, change: 34100, label: "长期示例区间" },
  ];
  const maxBalance = useMemo(() => Math.max(...metrics.map((metric) => metric.balance)), [metrics]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      toast.error("请先勾选邮箱同意选项。");
      return;
    }
    subscribe.mutate({ email, consent: true, source: "homepage" });
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f7f3] text-[#102d45]">
      <div className="demo-ribbon">虚构演示 · 非政府官方网站 · 数据仅供演示</div>
      <header className="relative z-20 border-b border-[#d7dfdb] bg-[#f6f7f3]/95 backdrop-blur">
        <div className="container flex h-[78px] items-center justify-between">
          <a href="#top" className="brand-lockup" aria-label="北辰成长计划首页">
            <span className="brand-mark"><Sparkles size={17} strokeWidth={2.5} /></span>
            <span>
              <span className="brand-name">北辰成长计划</span>
              <span className="brand-subtitle">成长计划</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#486073] md:flex" aria-label="Main navigation">
            <a href="#why">为什么重要</a>
            <a href="#projection">增长示例</a>
            <a href="#answers">常见问题</a>
            <Link href="/admin" className="nav-admin">管理预览 <ArrowUpRight size={14} /></Link>
          </nav>
          <button className="rounded-full p-2 md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
            <Menu size={22} />
          </button>
        </div>
        {menuOpen && <div className="container flex flex-col gap-4 border-t border-[#d7dfdb] py-5 text-sm font-semibold md:hidden"><a href="#why" onClick={() => setMenuOpen(false)}>为什么重要</a><a href="#projection" onClick={() => setMenuOpen(false)}>增长示例</a><Link href="/admin">管理预览</Link></div>}
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy reveal-up">
              <p className="eyebrow"><span className="eyebrow-dot" /> 用更清晰的方式规划未来</p>
              <h1>未来始于<em>小而持续</em>的一步。</h1>
              <p className="hero-lede">北辰成长计划是一个虚构的公共信息体验项目，探索长期机会、理性储蓄以及时间的力量。</p>
              <div className="hero-actions">
                <a href="#join" className="primary-button">获取最新动态 <ArrowUpRight size={16} /></a>
                <a href="#projection" className="text-button">查看增长示例 <ChevronDown size={16} /></a>
              </div>
              <div className="trust-line"><ShieldCheck size={17} /> 隐私优先 · 经本人同意 · 不连接任何金融账户</div>
            </div>
            <div className="hero-art reveal-up delay-1" aria-label="抽象北辰装饰插图">
              <div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="orbital orbital-three" />
              <div className="star-core"><Sparkles size={44} strokeWidth={1.3} /></div>
              <div className="art-caption"><span>01</span><span>长期思维</span></div>
            </div>
          </div>
          <div className="hero-ticker"><div className="container ticker-inner"><span>北辰 / 虚构计划</span><span>示例范围 2026—2050</span><span>追求清晰，而非承诺</span></div></div>
        </section>

        <section id="why" className="section-light">
          <div className="container intro-grid">
            <div><p className="eyebrow">全局视角</p><h2>重要成果往往源于<em>微小习惯。</em></h2></div>
            <div className="intro-text"><p>我们制作这个演示，是为了展示一个公共项目如何解释长期理念，而无需用户提交敏感账户信息。</p><p>了解项目故事、查看合成数字；只有在你愿意接收更新时才订阅。</p></div>
          </div>
          <div className="container feature-grid">
            <article className="feature-card"><div className="feature-icon"><TrendingUp size={22} /></div><span className="card-number">01</span><h3>尽早开始</h3><p>即使第一步很小，时间也能让持续投入拥有更多积累空间。</p></article>
            <article className="feature-card featured-card"><div className="feature-icon"><BarChart3 size={22} /></div><span className="card-number">02</span><h3>看见变化</h3><p>清晰的视觉呈现，有助于理解起点与长期示例之间的差异。</p></article>
            <article className="feature-card"><div className="feature-icon"><LockKeyhole size={22} /></div><span className="card-number">03</span><h3>保护隐私</h3><p>本演示只保存经本人同意提交的邮箱，不连接、读取或代表任何真实金融账户。</p></article>
          </div>
        </section>

        <section id="projection" className="projection-section">
          <div className="container">
            <div className="section-heading-row"><div><p className="eyebrow eyebrow-dark">简单增长示例</p><h2>让理念与你一起<em>成长</em>。</h2></div><div className="section-aside"><span className="aside-label">示例范围</span><strong>2026 — 2050</strong><span>不是承诺，也不是金融建议。</span></div></div>
            <div className="chart-shell">
              <div className="chart-header"><div><span className="chart-label">示例余额</span><strong>$51,200</strong></div><div className="chart-meta"><span className="legend-dot" /> 合成数据</div></div>
              <div className="chart-area">
                <div className="chart-y-axis"><span>$60k</span><span>$40k</span><span>$20k</span><span>$0</span></div>
                <div className="bars">{metrics.map((metric, index) => <div className="bar-group" key={metric.year}><div className="bar-value">${formatNumber.format(metric.balance)}</div><div className="bar" style={{ height: `${Math.max(8, (metric.balance / maxBalance) * 100)}%`, animationDelay: `${index * 90}ms` }}><span /></div><span className="bar-year">{metric.year}</span></div>)}</div>
              </div>
              <div className="chart-footnote"><span>初始示例：$1,000</span><span>本示例仅使用合成数值展示产品界面。</span></div>
            </div>
            <div className="projection-cards"><div><span>不追加投入</span><strong>$15,000</strong><small>仅供示例</small></div><div className="projection-card-accent"><span>保持持续习惯</span><strong>$51,200</strong><small>仅供示例</small></div><div><span>增加投入金额</span><strong>$124,000</strong><small>仅供示例</small></div></div>
          </div>
        </section>

        <section id="join" className="join-section"><div className="container join-grid"><div><p className="eyebrow eyebrow-dark">保持关注</p><h2>让下一章<em>更近。</em></h2><p className="join-copy">接收关于本虚构演示及其理念的偶尔更新。不发送垃圾邮件，不访问账户，并支持一键退订。</p></div><form className="signup-card" onSubmit={handleSubmit}><div className="input-label"><Mail size={17} /> 邮箱地址</div><input type="email" value={email} onChange={(event) => set邮箱(event.target.value)} placeholder="you@example.com" required aria-label="邮箱地址" /><label className="consent-row"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>我同意接收北辰成长计划更新，并了解这是一个虚构演示。</span></label><button className="primary-button full-width" type="submit" disabled={subscribe.isPending}>{subscribe.isPending ? "保存中…" : "提交订阅"}<ArrowUpRight size={16} /></button><p className="form-note">你的邮箱仅用于本演示的更新列表，可随时申请删除。</p></form></div></section>

        <section id="answers" className="section-light answers-section"><div className="container answers-grid"><div><p className="eyebrow">常见问题</p><h2>清晰，源于设计。</h2></div><div className="answers-list"><details open><summary>这是政府或金融服务吗？</summary><p>不是。北辰成长计划是一个虚构演示网站，与任何政府、银行、基金或公职人员均无关联。</p></details><details><summary>这些数字是真实的吗？</summary><p>不是。本页面中的余额、数量和预测均为用于展示界面的合成示例数据。</p></details><details><summary>提交订阅后会发生什么？</summary><p>经同意提交的邮箱会存储在项目所有者的管理预览中，你可以随时申请删除。</p></details></div></div></section>
      </main>
      <footer className="footer"><div className="container footer-inner"><div className="brand-lockup"><span className="brand-mark"><Sparkles size={17} /></span><span><span className="brand-name">北辰成长计划</span><span className="brand-subtitle">虚构演示</span></span></div><p>© 2026 北辰成长计划。仅供演示，与政府无关联。</p><Link href="/admin" className="footer-admin">管理预览 <ArrowUpRight size={14} /></Link></div></footer>
    </div>
  );
}
