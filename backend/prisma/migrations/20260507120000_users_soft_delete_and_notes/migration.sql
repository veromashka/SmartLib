-- 1. Add soft-delete marker to Users
ALTER TABLE "Users"
    ADD COLUMN "deletedAt" TIMESTAMP(3);

-- 2. Reading notes table
CREATE TABLE "Notes" (
    "id"           TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "bookId"       TEXT NOT NULL,
    "selectedText" TEXT NOT NULL,
    "comment"      TEXT,
    "pageNumber"   INTEGER,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- Indexes (mirrors @@index() in schema.prisma)
CREATE INDEX "Notes_userId_idx"          ON "Notes" ("userId");
CREATE INDEX "Notes_bookId_idx"          ON "Notes" ("bookId");
CREATE INDEX "Notes_userId_bookId_idx"   ON "Notes" ("userId", "bookId");

-- FKs
ALTER TABLE "Notes"
    ADD CONSTRAINT "Notes_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "Users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Notes"
    ADD CONSTRAINT "Notes_bookId_fkey"
    FOREIGN KEY ("bookId") REFERENCES "Books"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
