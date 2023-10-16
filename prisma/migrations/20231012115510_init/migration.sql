-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "expireDate" TIMESTAMP(3),
ALTER COLUMN "confirmationNumber" SET DEFAULT 0;
