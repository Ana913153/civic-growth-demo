import { ArrowLeft, Download, FileText, LockKeyhole, Mail, RefreshCw, ShieldCheck, Sparkles, Table2, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const data = trpc.admin.overview.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) return <div className="admin-loading"><RefreshCw className="spin" size={22} /> 正在加载安全管理预览…</div>;
  if (!isAuthenticated) {
    return <div className="admin-gate"><div className="admin-gate-card"><div className="brand-lockup justify-center"><span className="brand-mark"><Sparkles size={17} /></span><span><span className="brand-name">北辰成长计划</span><span className="brand-subtitle">管理预览</span></span></div><LockKeyhole size={34} className="mx-auto mt-10 text-[#d9a441]" /><h1>安全预览入口</h1><p>请使用项目所有者账号登录，以查看经同意提交的演示邮箱。本面板不是公开目录。</p><button className="primary-button mx-auto" onClick={() => startLogin()}>登录后继续 <ArrowLeft size={16} className="rotate-180" /></button><Link href="/" className="back-link"><ArrowLeft size={15} /> 返回公开页面</Link></div></div>;
  }
  if (user?.role !== "admin") return <div className="admin-gate"><div className="admin-gate-card"><ShieldCheck size={34} className="mx-auto text-[#d9a441]" /><h1>需要所有者权限</h1><p>你的账号已完成认证，但没有此预览所需的管理员权限。</p><Link href="/" className="back-link"><ArrowLeft size={15} /> 返回公开页面</Link></div></div>;

  const signups = data.data?.signups ?? [];
  const metrics = data.data?.syntheticMetrics ?? [];
  function exportCsv() {
    if (!signups.length) return toast.info("暂时没有可导出的订阅记录。");
    const csv = ["邮箱,来源,提交时间", ...signups.map((entry) => `${entry.email},${entry.source === "homepage" ? "首页" : entry.source},${new Date(entry.createdAt).toISOString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "northstar-demo-signups.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <div className="admin-page"><header className="admin-header"><div className="container flex items-center justify-between"><Link href="/" className="brand-lockup"><span className="brand-mark"><Sparkles size={17} /></span><span><span className="brand-name">北辰成长计划</span><span className="brand-subtitle">管理预览</span></span></Link><div className="admin-user"><span>{user.name || user.email || "所有者"}</span><Link href="/">公开页面 <ArrowLeft size={14} className="rotate-180" /></Link></div></div></header><main className="container admin-main"><div className="admin-intro"><div><p className="eyebrow">私密项目视图</p><h1>查看信息，而非账户。</h1><p>查看经同意提交的邮箱，以及公开演示使用的合成指标。这里的任何内容都不代表真实个人的财务情况。</p></div><div className="admin-status"><span className="status-dot" /> 所有者会话已开启</div></div><div className="admin-stats"><div><Mail size={20} /><span>已同意订阅数</span><strong>{signups.length}</strong></div><div><TrendingUp size={20} /><span>示例数据行</span><strong>{metrics.length}</strong></div><div><ShieldCheck size={20} /><span>数据状态</span><strong>仅供演示</strong></div></div><div className="admin-grid"><section className="admin-panel"><div className="panel-heading"><div><span className="panel-kicker"><Users size={15} /> 邮箱提交记录</span><h2>订阅者列表</h2></div><button className="outline-button" onClick={exportCsv}><Download size={15} /> 导出 CSV</button></div>{data.isLoading ? <div className="empty-state">正在加载订阅记录…</div> : signups.length === 0 ? <div className="empty-state"><FileText size={25} /><strong>暂时没有订阅</strong><span>来自公开页面且经过同意的邮箱会显示在这里。</span></div> : <div className="table-wrap"><table><thead><tr><th>邮箱</th><th>来源</th><th>提交时间</th></tr></thead><tbody>{signups.map((entry) => <tr key={entry.id}><td>{entry.email}</td><td><span className="source-pill">{entry.source === "homepage" ? "首页" : entry.source}</span></td><td>{new Date(entry.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div>}</section><section className="admin-panel"><div className="panel-heading"><div><span className="panel-kicker"><Table2 size={15} /> 合成指标</span><h2>已存储的示例</h2></div></div><div className="metric-list">{metrics.map((metric) => <div className="metric-row" key={metric.year}><div><strong>{metric.year}</strong><span>{metric.label}</span></div><div><strong>${metric.balance.toLocaleString()}</strong><span>+${metric.change.toLocaleString()}</span></div></div>)}</div><div className="synthetic-note"><ShieldCheck size={17} /><span>{data.data?.disclaimer || "仅为合成预测数据。"}</span></div></section></div></main></div>;
}
