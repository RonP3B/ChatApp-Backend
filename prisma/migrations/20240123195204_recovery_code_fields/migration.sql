-- AlterTable
ALTER TABLE "User" ADD COLUMN     "recoveryCode" STRING;
ALTER TABLE "User" ADD COLUMN     "recoveryCodeExpires" TIMESTAMP(3);
