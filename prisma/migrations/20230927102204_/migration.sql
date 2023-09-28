/*
  Warnings:

  - You are about to drop the column `bookId` on the `_BookToGenres` table. All the data in the column will be lost.
  - You are about to drop the column `genreId` on the `_BookToGenres` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[A,B]` on the table `_BookToGenres` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `A` to the `_BookToGenres` table without a default value. This is not possible if the table is not empty.
  - Added the required column `B` to the `_BookToGenres` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BookToGenres" DROP CONSTRAINT "_BookToGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToGenres" DROP CONSTRAINT "_BookToGenres_B_fkey";

-- DropIndex
DROP INDEX "_BookToGenres_AB_unique";

-- DropIndex
DROP INDEX "_BookToGenres_B_index";

-- AlterTable
ALTER TABLE "_BookToGenres" DROP COLUMN "bookId",
DROP COLUMN "genreId",
ADD COLUMN     "A" TEXT NOT NULL,
ADD COLUMN     "B" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_BookToGenres_AB_unique" ON "_BookToGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToGenres_B_index" ON "_BookToGenres"("B");

-- AddForeignKey
ALTER TABLE "_BookToGenres" ADD CONSTRAINT "_BookToGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToGenres" ADD CONSTRAINT "_BookToGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
