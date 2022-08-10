/*
  Warnings:

  - A unique constraint covering the columns `[password]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[password_series_and_number]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[password]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admin_password_key" ON "admin"("password");

-- CreateIndex
CREATE UNIQUE INDEX "admin_phone_number_key" ON "admin"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "student_phone_number_key" ON "student"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "student_password_series_and_number_key" ON "student"("password_series_and_number");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_password_key" ON "teacher"("password");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_phone_number_key" ON "teacher"("phone_number");
