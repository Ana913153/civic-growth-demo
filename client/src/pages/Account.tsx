import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowUpRight, CircleUserRound, LockKeyhole, LogOut, RefreshCw, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Account() {
  const { user, loading: authLoading, isAuthenticated, logout, refresh } = useAuth();
  const account = trpc.account.me.useQuery(undefined, { enabled: isAuthenticated });
  const [mode, setMode] = useState<"login" | "register" | "forgot">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const register = trpc.auth.registerEmail.useMutation({
    onSuccess: async () => { await refresh(); toast.success("注册成功", { description: "你的虚构账户已经创建。" }); },
    onError: (error) => toast.error("注册失败", { description: error.message }),
  });
  const login = trpc.auth.loginEmail.useMutation({
    onSuccess: async () => { await refresh(); toast.success("登录成功"); },
    onError: (error) => toast.error("登录失败", { description: error.message }),
  });
  const resetRequest = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: (result) => { toast.success("申请已记录", { description: result.message }); setMode("login"); },
    onError: (error) => toast.error("申请失败", { description: error.message }),
  });
  const changePassword = trpc.auth.changePassword.useMutation({
    onSuccess: () => { setCurrentPassword(""); setNewPassword(""); toast.success("密码已修改"); },
    onError: (error) => toast.error("密码修改失败", { description: error.message }),
  });

  if (authLoading) return <div className="account-loading"><RefreshCw className="spin" size={22} /> 正在加载安全账户中心…</div>;

  if (!isAuthenticated) {
    const submitEmailAuth = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (mode === "register") register.mutate({ email, password, name: name || undefined });
      else if (mode === "login") login.mutate({ email, password });
      else resetRequest.mutate({ email });
    };
    const pending = register.isPending || login.isPending || resetRequest.isPending;
    return <div className="account-gate"><div className="account-gate-card"><div className="account-brand"><span className="brand-mark"><Sparkles size={17} /></span><span><strong>北辰成长计划</strong><small>虚构账户中心</small></span></div><div className="account-gate-icon"><LockKeyhole size={28} /></div><p className="account-kicker">邮箱注册 / 登录</p><h1>{mode === "register" ? <>创建你的<br /><em>演示账户。</em></> : mode === "login" ? <>欢迎回来，<br /><em>继续查看。</em></> : <>找回你的<br /><em>账户访问。</em></>}</h1><p>{mode === "forgot" ? "输入注册邮箱，我们会记录重置申请。邮件发送服务配置完成后，系统才会发送真正的重置说明。" : "登录后只能查看属于你自己的虚拟演示数字。这里不提供真实余额、充值、提现或金融服务。"}</p><form className="account-auth-form" onSubmit={submitEmailAuth}>{mode === "register" && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="昵称（可选）" aria-label="昵称" maxLength={80} />}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="邮箱地址" aria-label="邮箱地址" required />{mode !== "forgot" && <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="密码（至少 8 位）" aria-label="密码" minLength={8} required />}<button className="account-primary-button" type="submit" disabled={pending}>{pending ? "处理中…" : mode === "register" ? "注册并继续" : mode === "login" ? "登录" : "提交找回申请"}<ArrowUpRight size={16} /></button></form>{mode === "login" && <button className="account-forgot-link" onClick={() => setMode("forgot")}>忘记密码？</button>}{mode !== "forgot" && <button className="account-mode-switch" onClick={() => setMode(mode === "register" ? "login" : "register")}>{mode === "register" ? "已有账户？点击登录" : "还没有账户？点击注册"}</button>}{mode === "forgot" && <button className="account-mode-switch" onClick={() => setMode("login")}>返回登录</button>}<div className="account-divider"><span>或</span></div><button className="account-manus-login" onClick={() => startLogin()}>使用安全登录服务继续</button><Link href="/" className="back-link"><ArrowLeft size={15} /> 返回首页</Link><p className="account-password-note">密码只以加密哈希形式保存，不会保存明文密码。请不要在此输入钱包密码、私钥或助记词。</p></div></div>;
  }

  const displayName = account.data?.name || user?.name || user?.email || "账户用户";
  const credits = account.data?.demoCredits ?? 0;
  async function handleLogout() { await logout(); toast.success("已安全退出"); }
  const submitChangePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changePassword.mutate({ currentPassword, newPassword });
  };

  return <div className="account-page"><header className="account-header"><div className="container account-header-inner"><Link href="/" className="account-brand"><span className="brand-mark"><Sparkles size={17} /></span><span><strong>北辰成长计划</strong><small>虚构账户中心</small></span></Link><div className="account-header-actions"><span className="account-user-name"><CircleUserRound size={16} /> {displayName}</span><button onClick={handleLogout} className="account-logout"><LogOut size={14} /> 退出</button></div></div></header><main className="container account-main"><div className="account-welcome"><div><p className="account-kicker">个人演示空间</p><h1>你好，{displayName}。</h1><p>这里显示的是项目所有者为你设置的虚拟积分，不代表现金或任何真实资产。</p></div><Link href="/" className="back-link"><ArrowLeft size={15} /> 返回首页</Link></div><div className="account-notice"><ShieldCheck size={18} /><span><strong>这是虚构演示账户</strong>　积分不可充值、不可提现、不可兑换，也不构成存款、投资或政府福利。</span></div><section className="balance-card"><div className="balance-card-top"><div><span className="balance-label"><WalletCards size={16} /> 我的演示积分</span><strong>{account.isLoading ? "…" : credits.toLocaleString()}</strong><small>虚拟数字 · 仅供页面演示</small></div><div className="balance-orb"><Sparkles size={28} /></div></div><div className="balance-card-bottom"><span>账户邮箱</span><strong>{account.data?.email || user?.email || "未提供"}</strong></div></section><section className="account-password-panel"><div><p className="account-kicker">账户安全</p><h2>修改密码</h2><p>定期更换密码，不要在多个网站重复使用同一个密码。</p></div><form className="account-change-form" onSubmit={submitChangePassword}><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="当前密码" minLength={8} required /><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="新密码（至少 8 位）" minLength={8} required /><button type="submit" className="account-primary-button" disabled={changePassword.isPending}>{changePassword.isPending ? "保存中…" : "保存新密码"}<ArrowUpRight size={15} /></button></form></section><div className="account-info-grid"><article><span className="info-icon"><ShieldCheck size={18} /></span><h2>数字从哪里来？</h2><p>项目管理员可以在后台为你的演示账户设置一个数字，用来展示账户中心的交互流程。</p></article><article><span className="info-icon"><LockKeyhole size={18} /></span><h2>你的信息如何保护？</h2><p>登录由安全认证服务处理。页面不会要求你提交私钥、助记词或支付信息。</p></article></div></main></div>;
}
