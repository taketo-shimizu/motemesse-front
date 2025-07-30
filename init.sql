-- pgvector extension を有効化
CREATE EXTENSION IF NOT EXISTS vector;

-- Note: User テーブルは Prisma migration で管理されます
-- このファイルは pgvector extension のみ有効化し、
-- テーブル作成は prisma migrate で行います