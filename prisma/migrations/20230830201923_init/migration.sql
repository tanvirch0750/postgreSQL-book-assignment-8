/*
  Warnings:

  - You are about to drop the `hh_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "hh_users";

-- CreateTable
CREATE TABLE "ase_users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "ase_users_pkey" PRIMARY KEY ("id")
);
