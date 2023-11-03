-- DropForeignKey
ALTER TABLE "BooksOrder" DROP CONSTRAINT "BooksOrder_orderId_fkey";

-- AddForeignKey
ALTER TABLE "BooksOrder" ADD CONSTRAINT "BooksOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
