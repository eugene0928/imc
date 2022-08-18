/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `faculty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "faculty_name_key" ON "faculty"("name");
