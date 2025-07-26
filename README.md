# モテメッセ フロントエンド

Next.js 14を使用したモテメッセのフロントエンドアプリケーション

## セットアップ

```bash
# 依存関係インストール
yarn install

# 開発サーバー起動
yarn dev
```

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + DaisyUI
- Prisma
- Auth0
- Zustand
- Axios

## ディレクトリ構造

```
src/
├── app/         # App Router
├── components/  # 共通コンポーネント
└── types/       # 型定義
```

## 環境変数

`.env.local.example`を`.env.local`にコピーして必要な値を設定してください。

## 開発コマンド

```bash
yarn dev      # 開発サーバー起動
yarn build    # ビルド
yarn start    # プロダクションサーバー起動
yarn lint     # リント実行
```