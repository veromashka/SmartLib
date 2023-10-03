/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `Books` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Books" ADD COLUMN     "orderId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "term" INTEGER NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_userId_key" ON "Orders"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Books_orderId_key" ON "Books"("orderId");

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
