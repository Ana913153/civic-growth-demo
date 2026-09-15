# Termux 连接与运行说明

## 1. 安装基础工具

```bash
pkg update && pkg upgrade -y
pkg install git nodejs-lts -y
```

如果需要使用 GitHub CLI，可以安装：

```bash
pkg install gh -y
```

## 2. 登录 GitHub

推荐使用 GitHub CLI 的设备登录流程，不要把密码或访问令牌直接写进命令历史：

```bash
gh auth login
```

按提示选择：

1. `GitHub.com`
2. `HTTPS`
3. `Login with a web browser`

然后在浏览器中完成设备验证码登录。登录账号应为 `Ana913153`。

也可以只使用 Git，不安装 `gh`。首次推送时，GitHub 会要求使用 Personal Access Token 作为密码；不要使用 GitHub 登录密码。

## 3. 克隆项目

```bash
cd ~
git clone https://github.com/Ana913153/civic-growth-demo.git
cd civic-growth-demo
```

## 4. 安装依赖

```bash
corepack enable
pnpm install
```

如果 Termux 中没有 `pnpm`，可以使用：

```bash
npm install -g pnpm
pnpm install
```

## 5. 本地检查

```bash
pnpm check
pnpm test -- --run
pnpm build
```

## 6. 启动开发预览

```bash
pnpm dev
```

然后在 Termux 显示的本地地址打开页面。停止服务使用 `Ctrl + C`。

## 7. 修改后推送到 GitHub

```bash
git status
git add .
git commit -m "更新中文页面"
git push origin main
```

## 8. 重要说明

本项目使用 Manus 的 OAuth、数据库和运行环境变量。直接在 Termux 中运行时，如果没有配置对应的 `DATABASE_URL`、OAuth 和项目运行环境，邮箱提交与管理员面板可能无法完整工作。不要把 `.env`、数据库密码、OAuth 密钥或 GitHub Token 提交到仓库。

本项目中的增长数字是合成演示数据，网站也明确标注为虚构演示，并非政府或金融机构服务。

## 9. 账户中心与虚拟积分演示

首页右上角新增“账户注册 / 登录”，页面路径为：

```text
/account
```

登录后，用户只能查看自己的虚拟演示积分。该数字：

- 不是现金或真实账户余额；
- 不支持充值、提现或兑换；
- 不构成存款、投资、政府福利或金融服务；
- 由安全登录后的用户本人查看。

管理员可以打开：

```text
/admin
```

在“虚拟积分设置”中选择已登录用户，并保存演示积分。管理员功能受到登录身份和管理员角色保护。

在 Termux 中同步最新代码：

```bash
cd ~/civic-growth-demo
git pull origin main
pnpm install
pnpm check
pnpm test -- --run
pnpm dev --host 0.0.0.0
```

如果你在本地开发分支修改了代码，提交并推送：

```bash
git add .
git commit -m "增加虚拟账户中心"
git push origin main
```

请不要在账户中心中加入真实金融余额，也不要将密码、私钥、助记词、数据库密码或 OAuth 密钥提交到 GitHub。

## 10. 邮箱密码注册登录

首页移动端右上角的黄色“注册 / 登录”按钮位于三横线菜单旁边。账户页路径：

```text
/account
```

注册时填写邮箱和至少 8 位密码。密码只以加盐哈希形式保存，数据库不保存明文密码。登录后可以查看自己的虚拟演示积分；该数字不可充值、不可提现、不可兑换。

在 Termux 中同步本次更新：

```bash
cd ~/civic-growth-demo
git pull origin main
pnpm install
pnpm check
pnpm test -- --run
pnpm dev --host 0.0.0.0
```

如果需要把 Termux 中的修改推送到 GitHub：

```bash
cd ~/civic-growth-demo
git status
git add .
git commit -m "增加邮箱密码注册登录"
git push origin main
```

不要提交 `.env`、数据库密码、JWT 密钥、钱包私钥、助记词或 GitHub Token。

## 11. 修改密码与忘记密码

登录账户中心后，在“账户安全”区域可以使用当前密码设置新密码。新密码至少 8 位。

未登录时点击“忘记密码？”可以提交注册邮箱。当前项目已经安全记录重置申请，但还没有接入邮件发送服务，因此不会在页面显示重置令牌。正式启用邮件找回前，需要配置可信的事务邮件服务，并由服务端发送一次性、限时重置链接。

同步最新版本：

```bash
cd ~/civic-growth-demo
git pull origin main
pnpm install
pnpm check
pnpm test -- --run
```

## 12. 独立管理后台登录

管理后台不使用普通用户注册账户。后台地址：

```text
/admin
```

后台使用独立管理员账号登录。当前已配置的管理员账号为：

```text
账号：amin6688
```

密码不会写入 GitHub 代码，只以加盐哈希形式存储在数据库中。登录成功后才能查看订阅邮箱和调整用户虚拟演示积分。

Termux 同步后台版本：

```bash
cd ~/civic-growth-demo
git pull origin main
pnpm install
pnpm check
pnpm test -- --run
pnpm dev --host 0.0.0.0
```

请勿把管理员密码提交到 GitHub，也不要在公开截图或聊天中重复使用该密码；正式上线前请更换为新的强密码。
