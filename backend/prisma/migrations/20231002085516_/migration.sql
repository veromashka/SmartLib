/*
  Warnings:

  - You are about to drop the `_BooksToGenres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BooksToGenres" DROP CONSTRAINT "_BooksToGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_BooksToGenres" DROP CONSTRAINT "_BooksToGenres_B_fkey";

-- DropTable
DROP TABLE "_BooksToGenres";

-- CreateTable
CREATE TABLE "BookGenres" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "bookId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "BookGenres_pkey" PRIMARY KEY ("genreId","bookId")
);

-- AddForeignKey
ALTER TABLE "BookGenres" ADD CONSTRAINT "BookGenres_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenres" ADD CONSTRAINT "BookGenres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
