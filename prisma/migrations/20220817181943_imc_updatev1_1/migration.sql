/*
  Warnings:

  - You are about to drop the column `assignedBy` on the `GroupTeacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GroupTeacher" DROP COLUMN "assignedBy",
ADD COLUMN     "deleted_at" DATE;
