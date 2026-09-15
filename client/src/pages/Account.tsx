import { ArrowLeft, ArrowUpRight, CircleUserRound, LockKeyhole, LogOut, RefreshCw, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Account() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const account = trpc.account.me.useQuery(undefined, { enabled: isAuthenticated });

  if (authLoading) return <div className="account-loading"><RefreshCw className="spin" size={22} /> 正在加载安全账户中心…</div>;

  if (!isAuthenticated) {
    return <div className="account-gate"><div className="account-gate-card"><div className="account-brand"><span className="brand-mark"><Sparkles size={17} /></span><span><strong>北辰成长计划</strong><small>虚构账户中心</small></span></div><div className="account-gate-icon"><LockKeyhole size={28} /></div><p className="account-kicker">账户注册 / 登录</p><h1>查看你的<br /><em>演示积分。</em></h1><p>登录后只能查看属于你自己的虚拟演示数字。这里不提供真实余额、充值、提现或金融服务。</p><button className="account-primary-button" onClick={() => startLogin()}>登录或注册 <ArrowUpRight size={16} /></button><Link href="/" className="back-link"><ArrowLeft size={15} /> 返回首页</Link></div></div>;
  }

  const displayName = account.data?.name || user?.name || user?.email || "账户用户";
  const credits = account.data?.demoCredits ?? 0;

  async function handleLogout() {
    await logout();
    toast.success("已安全退出");
  }

  return <div className="account-page"><header className="account-header"><div className="container account-header-inner"><Link href="/" className="account-brand"><span className="brand-mark"><Sparkles size={17} /></span><span><strong>北辰成长计划</strong><small>虚构账户中心</small></span></Link><div className="account-header-actions"><span className="account-user-name"><CircleUserRound size={16} /> {displayName}</span><button onClick={handleLogout} className="account-logout"><LogOut size={14} /> 退出</button></div></div></header><main className="container account-main"><div className="account-welcome"><div><p className="account-kicker">个人演示空间</p><h1>你好，{displayName}。</h1><p>这里显示的是项目所有者为你设置的虚拟积分，不代表现金或任何真实资产。</p></div><Link href="/" className="back-link"><ArrowLeft size={15} /> 返回首页</Link></div><div className="account-notice"><ShieldCheck size={18} /><span><strong>这是虚构演示账户</strong>　积分不可充值、不可提现、不可兑换，也不构成存款、投资或政府福利。</span></div><section className="balance-card"><div className="balance-card-top"><div><span className="balance-label"><WalletCards size={16} /> 我的演示积分</span><strong>{account.isLoading ? "…" : credits.toLocaleString()}</strong><small>虚拟数字 · 仅供页面演示</small></div><div className="balance-orb"><Sparkles size={28} /></div></div><div className="balance-card-bottom"><span>账户邮箱</span><strong>{account.data?.email || user?.email || "未提供"}</strong></div></section><div className="account-info-grid"><article><span className="info-icon"><ShieldCheck size={18} /></span><h2>数字从哪里来？</h2><p>项目管理员可以在后台为你的演示账户设置一个数字，用来展示账户中心的交互流程。</p></article><article><span className="info-icon"><LockKeyhole size={18} /></span><h2>你的信息如何保护？</h2><p>登录由安全认证服务处理。页面不会要求你提交密码、私钥、助记词或支付信息。</p></article></div></main></div>;
}
