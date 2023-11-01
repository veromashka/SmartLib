/*
  Warnings:

  - The primary key for the `BooksOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_BooksOrderToOrders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BooksOrderToOrders" DROP CONSTRAINT "_BooksOrderToOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_BooksOrderToOrders" DROP CONSTRAINT "_BooksOrderToOrders_B_fkey";

-- AlterTable
ALTER TABLE "BooksOrder" DROP CONSTRAINT "BooksOrder_pkey",
ADD CONSTRAINT "BooksOrder_pkey" PRIMARY KEY ("orderId", "bookId");

-- DropTable
DROP TABLE "_BooksOrderToOrders";

-- AddForeignKey
ALTER TABLE "BooksOrder" ADD CONSTRAINT "BooksOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
