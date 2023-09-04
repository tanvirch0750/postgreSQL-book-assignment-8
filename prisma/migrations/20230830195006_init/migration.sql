/*
  Warnings:

  - You are about to drop the `test_db` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "test_db";

-- CreateTable
CREATE TABLE "hh_users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "hh_users_pkey" PRIMARY KEY ("id")
);
