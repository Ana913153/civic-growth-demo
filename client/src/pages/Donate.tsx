import { useState } from "react";
import { ArrowLeft, Check, Copy, Heart, ShieldCheck, Wallet } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

// 请替换为你自己的 Bitcoin 主网公开收款地址；不要填写私钥或助记词。
const BITCOIN_ADDRESS = "bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const IS_PLACEHOLDER = BITCOIN_ADDRESS.includes("xxxxxxxx");

export default function Donate() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(BITCOIN_ADDRESS);
      setCopied(true);
      toast.success("比特币地址已复制");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("复制失败，请手动复制地址");
    }
  }

  return (
    <div className="donate-page">
      <header className="donate-header">
        <div className="container donate-header-inner">
          <Link href="/" className="brand-lockup">
            <span className="brand-mark"><Heart size={17} /></span>
            <span><span className="brand-name">北辰成长计划</span><span className="brand-subtitle">捐款页面</span></span>
          </Link>
          <Link href="/" className="back-link"><ArrowLeft size={15} /> 返回首页</Link>
        </div>
      </header>

      <main className="container donate-main">
        <section className="donate-card">
          <div className="donate-icon"><Wallet size={28} /></div>
          <p className="eyebrow">比特币支持</p>
          <h1>用你的支持，<em>推动下一步。</em></h1>
          <p className="donate-description">如果你认可这个项目，可以通过比特币向我们提供支持。请在发送前仔细核对地址和网络。</p>

          <div className="network-warning"><ShieldCheck size={18} /><span>仅支持 Bitcoin 主网。发送到错误网络或错误地址的资金可能无法找回。</span></div>

          <div className="qr-placeholder" aria-label="比特币收款二维码占位区域">
            <div className="qr-inner"><div className="qr-pattern"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></div>
            <small>{IS_PLACEHOLDER ? "替换真实地址后再生成二维码" : "请使用钱包扫描二维码"}</small>
          </div>

          {IS_PLACEHOLDER && <div className="placeholder-warning">当前为占位地址，不要向此地址发送真实资金。</div>}
          <label className="address-label">Bitcoin 收款地址</label>
          <div className="address-box"><code>{BITCOIN_ADDRESS}</code><button type="button" className="copy-button" onClick={copyAddress} aria-label="复制比特币地址">{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? "已复制" : "复制"}</button></div>
          <p className="donate-note">捐款完成后，区块链确认可能需要一些时间。我们不会要求你提供私钥、助记词或钱包密码。</p>
        </section>
      </main>
    </div>
  );
}
