/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Contato` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contato" DROP COLUMN "updatedAt",
ALTER COLUMN "complemento" DROP NOT NULL;
