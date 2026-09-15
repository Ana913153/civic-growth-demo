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
