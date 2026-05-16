-- AlterTable: Change embedding dimension from 768 to 3072 for gemini-embedding-001
-- First, delete all existing embeddings since we can't convert dimensions
DELETE FROM "VideoEmbedding";

-- Now alter the column type
ALTER TABLE "VideoEmbedding" ALTER COLUMN "chunkEmbedding" TYPE vector(3072);
