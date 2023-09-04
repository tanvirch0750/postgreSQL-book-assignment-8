/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "test_db" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "test_db_pkey" PRIMARY KEY ("id")
);
