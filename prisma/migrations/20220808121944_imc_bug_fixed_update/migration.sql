/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "gender" VARCHAR(6) DEFAULT 'male',
ADD COLUMN     "phone_number" VARCHAR(12) NOT NULL;

-- AlterTable
ALTER TABLE "teacher" ADD COLUMN     "date_of_birth" DATE NOT NULL,
ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "gender" VARCHAR(6) DEFAULT 'male',
ADD COLUMN     "phone_number" VARCHAR(12) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_email_key" ON "teacher"("email");
