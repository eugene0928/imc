/*
  Warnings:

  - Added the required column `subject_id` to the `teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teacher" ADD COLUMN     "subject_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
