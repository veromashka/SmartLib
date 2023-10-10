/*
  Warnings:

  - Added the required column `createdAt` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "term" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Profiles" ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
