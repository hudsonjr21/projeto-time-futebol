/*
  Warnings:

  - You are about to drop the column `awayScore` on the `scores` table. All the data in the column will be lost.
  - You are about to drop the column `homeScore` on the `scores` table. All the data in the column will be lost.
  - Added the required column `away_score` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `home_score` to the `scores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scores" DROP COLUMN "awayScore",
DROP COLUMN "homeScore",
ADD COLUMN     "away_score" INTEGER NOT NULL,
ADD COLUMN     "home_score" INTEGER NOT NULL;
