/*
  Warnings:

  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the column as nullable
ALTER TABLE "public"."User" ADD COLUMN "passwordHash" TEXT;

-- Update existing users with a temporary password hash (they'll need to reset their passwords)
UPDATE "public"."User" SET "passwordHash" = '$2a$12$temp.hash.for.existing.users' WHERE "passwordHash" IS NULL;

-- Now make the column NOT NULL
ALTER TABLE "public"."User" ALTER COLUMN "passwordHash" SET NOT NULL;
