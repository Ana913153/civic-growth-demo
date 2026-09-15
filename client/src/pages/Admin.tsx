import { ArrowLeft, Download, FileText, LockKeyhole, Mail, RefreshCw, ShieldCheck, Sparkles, Table2, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const data = trpc.admin.overview.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) return <div className="admin-loading"><RefreshCw className="spin" size={22} /> Loading secure preview…</div>;
  if (!isAuthenticated) {
    return <div className="admin-gate"><div className="admin-gate-card"><div className="brand-lockup justify-center"><span className="brand-mark"><Sparkles size={17} /></span><span><span className="brand-name">NORTHSTAR</span><span className="brand-subtitle">ADMIN PREVIEW</span></span></div><LockKeyhole size={34} className="mx-auto mt-10 text-[#d9a441]" /><h1>Secure preview access</h1><p>Sign in with the project owner account to view consented demo signups. This panel is not a public directory.</p><button className="primary-button mx-auto" onClick={() => startLogin()}>Sign in to continue <ArrowLeft size={16} className="rotate-180" /></button><Link href="/" className="back-link"><ArrowLeft size={15} /> Return to public page</Link></div></div>;
  }
  if (user?.role !== "admin") return <div className="admin-gate"><div className="admin-gate-card"><ShieldCheck size={34} className="mx-auto text-[#d9a441]" /><h1>Owner access required</h1><p>Your account is authenticated, but it does not have administrator permissions for this preview.</p><Link href="/" className="back-link"><ArrowLeft size={15} /> Return to public page</Link></div></div>;

  const signups = data.data?.signups ?? [];
  const metrics = data.data?.syntheticMetrics ?? [];
  function exportCsv() {
    if (!signups.length) return toast.info("No consented signups to export yet.");
    const csv = ["email,source,createdAt", ...signups.map((entry) => `${entry.email},${entry.source},${new Date(entry.createdAt).toISOString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "northstar-demo-signups.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <div className="admin-page"><header className="admin-header"><div className="container flex items-center justify-between"><Link href="/" className="brand-lockup"><span className="brand-mark"><Sparkles size={17} /></span><span><span className="brand-name">NORTHSTAR</span><span className="brand-subtitle">ADMIN PREVIEW</span></span></Link><div className="admin-user"><span>{user.name || user.email || "Owner"}</span><Link href="/">Public page <ArrowLeft size={14} className="rotate-180" /></Link></div></div></header><main className="container admin-main"><div className="admin-intro"><div><p className="eyebrow">PRIVATE PROJECT VIEW</p><h1>Signals, not accounts.</h1><p>Review consented email signups and the synthetic metrics used by the public demo. Nothing here represents a real person’s finances.</p></div><div className="admin-status"><span className="status-dot" /> Owner session active</div></div><div className="admin-stats"><div><Mail size={20} /><span>Consented signups</span><strong>{signups.length}</strong></div><div><TrendingUp size={20} /><span>Illustrative rows</span><strong>{metrics.length}</strong></div><div><ShieldCheck size={20} /><span>Data status</span><strong>Demo only</strong></div></div><div className="admin-grid"><section className="admin-panel"><div className="panel-heading"><div><span className="panel-kicker"><Users size={15} /> EMAIL SUBMISSIONS</span><h2>Subscriber list</h2></div><button className="outline-button" onClick={exportCsv}><Download size={15} /> Export CSV</button></div>{data.isLoading ? <div className="empty-state">Loading signups…</div> : signups.length === 0 ? <div className="empty-state"><FileText size={25} /><strong>No signups yet</strong><span>Consent-based emails from the public page will appear here.</span></div> : <div className="table-wrap"><table><thead><tr><th>Email</th><th>Source</th><th>Received</th></tr></thead><tbody>{signups.map((entry) => <tr key={entry.id}><td>{entry.email}</td><td><span className="source-pill">{entry.source}</span></td><td>{new Date(entry.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div>}</section><section className="admin-panel"><div className="panel-heading"><div><span className="panel-kicker"><Table2 size={15} /> SYNTHETIC METRICS</span><h2>Stored illustrations</h2></div></div><div className="metric-list">{metrics.map((metric) => <div className="metric-row" key={metric.year}><div><strong>{metric.year}</strong><span>{metric.label}</span></div><div><strong>${metric.balance.toLocaleString()}</strong><span>+${metric.change.toLocaleString()}</span></div></div>)}</div><div className="synthetic-note"><ShieldCheck size={17} /><span>{data.data?.disclaimer || "Synthetic projection data only."}</span></div></section></div></main></div>;
}
