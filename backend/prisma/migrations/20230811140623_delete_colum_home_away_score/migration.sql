/*
  Warnings:

  - You are about to drop the column `away_score` on the `gameDetails` table. All the data in the column will be lost.
  - You are about to drop the column `home_score` on the `gameDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gameDetails" DROP COLUMN "away_score",
DROP COLUMN "home_score";
