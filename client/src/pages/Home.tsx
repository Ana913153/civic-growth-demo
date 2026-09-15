import { FormEvent, useState } from "react";
import { ArrowUpRight, BarChart3, ChevronDown, LockKeyhole, Mail, Menu, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overview = trpc.public.overview.useQuery();
  const subscribe = trpc.public.subscribe.useMutation({
    onSuccess: () => {
      setEmail("");
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      toast.error("请先勾选邮箱同意选项。");
      return;
    }
    subscribe.mutate({ email, consent: true, source: "homepage" });
  }

  return (
    <div className="mobile-demo-page">
      <div className="demo-ribbon">美国政府官方网站</div>
      <header className="mobile-demo-header">
        <div className="mobile-demo-brand"><span className="mini-flag">✦</span><span>北辰成长计划</span></div>
        <nav className="mobile-demo-nav">
          <a href="#story">项目介绍</a><a href="#projection">增长示例</a><Link href="/donate">支持项目</Link><Link href="/account" className="account-nav-link">账户注册 / 登录 <ArrowUpRight size={13} /></Link><Link href="/admin">管理预览</Link>
        </nav>
        <div className="mobile-header-actions"><Link href="/account" className="mobile-account-button">注册 / 登录 <ArrowUpRight size={13} /></Link><button className="mobile-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="打开菜单"><Menu size={20} /></button></div>
      </header>
      {menuOpen && <div className="mobile-demo-menu"><a href="#story" onClick={() => setMenuOpen(false)}>项目介绍</a><a href="#projection" onClick={() => setMenuOpen(false)}>增长示例</a><Link href="/donate">支持项目</Link><Link href="/account">账户注册 / 登录</Link><Link href="/admin">管理预览</Link></div>}

      <main>
        <section className="mobile-hero">
          <div className="demo-app-icon"><Sparkles size={30} strokeWidth={1.5} /><span /></div>
          <p className="mobile-kicker">北辰成长计划 · 虚构体验</p>
          <h1>未来从<br /><em>小事开始。</em></h1>
          <p className="mobile-hero-copy">这是一个关于长期机会、理性储蓄和时间力量的虚构公共信息体验。不代表任何政府、银行或金融机构。</p>
          <a href="#join" className="mobile-primary-button">获取项目动态 <ArrowUpRight size={17} /></a>
          <div className="mobile-trust"><ShieldCheck size={16} /> 不连接真实金融账户 · 仅使用合成数据</div>
          <div className="floating-coin coin-left"><span>✦</span></div>
          <div className="floating-coin coin-right"><span>北</span></div>
        </section>

        <section id="story" className="mobile-story-section">
          <p className="mobile-kicker">关于这个演示</p>
          <h2>让长期思考<br /><em>更容易理解。</em></h2>
          <p>我们用简单的视觉、合成数字和清晰说明，展示一个公共项目如何讲述未来规划，而不要求你交出敏感账户信息。</p>
          <div className="mobile-feature-list">
            <article><span><TrendingUp size={19} /></span><div><strong>尽早开始</strong><p>小而持续的习惯可以拥有更长的积累时间。</p></div></article>
            <article><span><BarChart3 size={19} /></span><div><strong>看见变化</strong><p>示例图表帮助理解长期数字的变化形状。</p></div></article>
            <article><span><LockKeyhole size={19} /></span><div><strong>保护隐私</strong><p>不读取、不连接、不代表任何真实金融账户。</p></div></article>
          </div>
        </section>

        <section id="projection" className="mobile-projection-section">
          <p className="mobile-kicker">合成增长示例</p>
          <h2>让理念与你一起<em>成长。</em></h2>
          <div className="mobile-chart-card">
            <div className="mobile-chart-top"><span>示例余额</span><strong>$51,200</strong><small>合成数据</small></div>
            <div className="mobile-bars">{metrics.map((metric) => <div className="mobile-bar-group" key={metric.year}><span>${metric.balance.toLocaleString()}</span><div className="mobile-bar" style={{ height: `${Math.max(10, (metric.balance / 51200) * 100)}%` }} /><small>{metric.year}</small></div>)}</div>
          </div>
          <div className="mobile-scenario-row"><div><span>不追加投入</span><strong>$15,000</strong></div><div><span>保持持续习惯</span><strong>$51,200</strong></div><div><span>增加投入金额</span><strong>$124,000</strong></div></div>
          <div className="mobile-disclaimer">所有数字均为合成示例，不构成承诺、投资建议或真实账户余额。</div>
        </section>

        <section id="join" className="mobile-join-section">
          <p className="mobile-kicker">保持关注</p><h2>下一章，<em>更近。</em></h2><p>接收关于本虚构演示的偶尔更新。不发送垃圾邮件，可随时申请删除。</p>
          <form className="mobile-signup-card" onSubmit={handleSubmit}><label><Mail size={16} /> 邮箱地址</label><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /><label className="mobile-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>我同意接收更新，并了解这是虚构演示。</span></label><button type="submit" disabled={subscribe.isPending}>{subscribe.isPending ? "保存中…" : "提交订阅"}<ArrowUpRight size={16} /></button></form>
        </section>
      </main>

      <footer className="mobile-demo-footer"><span>北辰成长计划 · 虚构演示</span><div><Link href="/account">账户中心</Link><Link href="/donate">比特币支持</Link><Link href="/admin">管理预览</Link></div></footer>
    </div>
  );
}
