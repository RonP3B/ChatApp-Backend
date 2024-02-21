-- CreateTable
CREATE TABLE "RoomLastChecked" (
    "id" STRING NOT NULL,
    "lastChecked" TIMESTAMP(3) NOT NULL,
    "userId" STRING NOT NULL,
    "roomId" STRING NOT NULL,

    CONSTRAINT "RoomLastChecked_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoomLastChecked" ADD CONSTRAINT "RoomLastChecked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomLastChecked" ADD CONSTRAINT "RoomLastChecked_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
