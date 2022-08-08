/*
  Warnings:

  - You are about to drop the column `family_name` on the `student` table. All the data in the column will be lost.
  - Added the required column `image` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `super_admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student" DROP COLUMN "family_name",
ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "super_admin" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teacher" ADD COLUMN     "image" TEXT NOT NULL;
