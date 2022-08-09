/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `student` table. All the data in the column will be lost.
  - Added the required column `subject_id` to the `Mark` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Mark_semester_id_key";

-- AlterTable
ALTER TABLE "Mark" ADD COLUMN     "subject_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "student" DROP COLUMN "dateOfBirth",
ADD COLUMN     "date_of_birth" DATE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
