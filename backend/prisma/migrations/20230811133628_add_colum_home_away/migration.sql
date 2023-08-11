/*
  Warnings:

  - Added the required column `away_score` to the `gameDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `home_score` to the `gameDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gameDetails" ADD COLUMN     "away_score" INTEGER NOT NULL,
ADD COLUMN     "home_score" INTEGER NOT NULL;
