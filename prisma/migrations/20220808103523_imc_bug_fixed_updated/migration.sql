/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "admin" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "faculty" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "super_admin" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "teacher" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");
