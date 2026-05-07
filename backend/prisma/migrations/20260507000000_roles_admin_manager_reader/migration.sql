-- AlterEnum: replace old Roles values (USER, EDITOR, ADMIN)
--   with new business roles (ADMIN, MANAGER, READER).
--
-- Strategy:
--   1. Create the new enum type.
--   2. Migrate the column to TEXT to allow value remap.
--   3. Map: USER -> READER, EDITOR -> MANAGER, ADMIN -> ADMIN.
--   4. Cast back into the new enum, drop the old one.

-- 1. New enum
CREATE TYPE "Roles_new" AS ENUM ('ADMIN', 'MANAGER', 'READER');

-- 2. Detach default & cast to text
ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "role" TYPE TEXT USING "role"::TEXT;

-- 3. Remap legacy values
UPDATE "Users" SET "role" = 'READER'  WHERE "role" = 'USER';
UPDATE "Users" SET "role" = 'MANAGER' WHERE "role" = 'EDITOR';
-- ADMIN stays ADMIN

-- 4. Swap enums
ALTER TABLE "Users"
    ALTER COLUMN "role" TYPE "Roles_new" USING "role"::"Roles_new";

DROP TYPE "Roles";
ALTER TYPE "Roles_new" RENAME TO "Roles";

ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'READER';
