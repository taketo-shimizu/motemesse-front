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

## 📄 ライセンス / License

© 2025 清水 威斗 (Taketo Shimizu). All rights reserved.

本リポジトリに含まれるソースコード、デザイン、その他のリソースは、著作権によって保護されています。  
本サービスは公開運用を目的としたプロダクトであり、いかなる形式でも、  
**無断での複製・再利用・派生物の作成・再配布・商用利用を禁止**します。

This software is a proprietary project intended for public release as a product.  
All content in this repository is protected by copyright.  
**Unauthorized copying, reproduction, redistribution, commercial use, or derivative works are strictly prohibited.**

If you wish to use any part of this code, please contact the author.
