# 環境変数の管理方法

## ローカル開発とデプロイの使い分け

### 1. ローカル開発時
`.env.local`を使用（ローカルのPostgreSQLを参照）
```bash
# ローカルDBで開発
npm run dev
```

### 2. Supabaseへの初回マイグレーション
一時的に`.env.local`を本番DB情報に書き換えてマイグレーション実行
```bash
# .env.localを一時的にSupabaseのURLに変更
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# マイグレーション実行
npx prisma db push

# 完了後、.env.localをローカルDB情報に戻す
DATABASE_URL="postgresql://motemesse_user:motemesse_password@localhost:5432/motemesse?schema=public"
```

### 3. Vercelデプロイ時
Vercelの管理画面で環境変数を設定（`.env.production`の内容を参考に）

## 環境変数ファイルの使い分け

| ファイル | 用途 | Git管理 |
|---------|------|---------|
| `.env.local` | ローカル開発用 | ❌ 除外 |
| `.env.production` | 本番値の参考用 | ❌ 除外 |
| `.env.local.sample` | サンプル | ✅ 含める |

## Prismaマイグレーションのベストプラクティス

### 開発フロー
1. ローカルDBで開発・テスト
2. スキーマ変更時は`prisma migrate dev`でローカルに適用
3. 動作確認後、本番（Supabase）に`prisma db push`で適用

### コマンド例
```bash
# ローカル開発（.env.localがローカルDBを指す状態）
npx prisma migrate dev --name add_new_feature

# 本番反映時のみ
export DATABASE_URL="[Supabase URL]"
npx prisma db push
unset DATABASE_URL  # 環境変数をクリア
```