/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `subject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subject_name_key" ON "subject"("name");
