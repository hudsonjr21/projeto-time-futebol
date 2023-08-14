/*
  Warnings:

  - Added the required column `game_id` to the `scores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scores" ADD COLUMN     "game_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
