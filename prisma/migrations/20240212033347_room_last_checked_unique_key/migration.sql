/*
  Warnings:

  - The primary key for the `RoomLastChecked` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RoomLastChecked` table. All the data in the column will be lost.

*/
-- RedefineTables
CREATE TABLE "_prisma_new_RoomLastChecked" (
    "lastChecked" TIMESTAMP(3) NOT NULL,
    "userId" STRING NOT NULL,
    "roomId" STRING NOT NULL
);
INSERT INTO "_prisma_new_RoomLastChecked" ("lastChecked","roomId","userId") SELECT "lastChecked","roomId","userId" FROM "RoomLastChecked";
DROP TABLE "RoomLastChecked" CASCADE;
ALTER TABLE "_prisma_new_RoomLastChecked" RENAME TO "RoomLastChecked";
CREATE UNIQUE INDEX "RoomLastChecked_userId_roomId_key" ON "RoomLastChecked"("userId", "roomId");
ALTER TABLE "RoomLastChecked" ADD CONSTRAINT "RoomLastChecked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RoomLastChecked" ADD CONSTRAINT "RoomLastChecked_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
