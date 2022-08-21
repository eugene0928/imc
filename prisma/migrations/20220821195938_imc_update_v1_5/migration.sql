/*
  Warnings:

  - You are about to drop the column `password_series_and_number` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[passport_series_and_number]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "student_password_series_and_number_key";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "password_series_and_number",
ADD COLUMN     "passport_series_and_number" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "student_passport_series_and_number_key" ON "student"("passport_series_and_number");
