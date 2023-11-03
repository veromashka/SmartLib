/*
  Warnings:

  - The primary key for the `BooksOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "BooksOrder" DROP CONSTRAINT "BooksOrder_orderId_fkey";

-- AlterTable
ALTER TABLE "BooksOrder" DROP CONSTRAINT "BooksOrder_pkey",
ADD CONSTRAINT "BooksOrder_pkey" PRIMARY KEY ("bookId");

-- CreateTable
CREATE TABLE "_BooksOrderToOrders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BooksOrderToOrders_AB_unique" ON "_BooksOrderToOrders"("A", "B");

-- CreateIndex
CREATE INDEX "_BooksOrderToOrders_B_index" ON "_BooksOrderToOrders"("B");

-- AddForeignKey
ALTER TABLE "_BooksOrderToOrders" ADD CONSTRAINT "_BooksOrderToOrders_A_fkey" FOREIGN KEY ("A") REFERENCES "BooksOrder"("bookId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksOrderToOrders" ADD CONSTRAINT "_BooksOrderToOrders_B_fkey" FOREIGN KEY ("B") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
