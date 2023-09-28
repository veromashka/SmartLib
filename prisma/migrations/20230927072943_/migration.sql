/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Genres` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `BookGenres` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('FOR_CHILDREN', 'FOR_TEENS', 'FOR_ADULTS');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'EDITOR', 'ADMIN');

-- DropForeignKey
ALTER TABLE "BookGenres" DROP CONSTRAINT "BookGenres_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookGenres" DROP CONSTRAINT "BookGenres_genreId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Book_id_seq";

-- AlterTable
ALTER TABLE "Genres" DROP CONSTRAINT "Genres_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Genres_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Genres_id_seq";

-- DropTable
DROP TABLE "BookGenres";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookToGenres" (
    "bookId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_BookToGenres_AB_unique" ON "_BookToGenres"("bookId", "genreId");

-- CreateIndex
CREATE INDEX "_BookToGenres_B_index" ON "_BookToGenres"("genreId");

-- AddForeignKey
ALTER TABLE "_BookToGenres" ADD CONSTRAINT "_BookToGenres_A_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToGenres" ADD CONSTRAINT "_BookToGenres_B_fkey" FOREIGN KEY ("genreId") REFERENCES "Genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
