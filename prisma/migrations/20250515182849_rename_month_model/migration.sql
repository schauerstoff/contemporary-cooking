/*
  Warnings:

  - You are about to drop the `Month` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IngredientToMonth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Month";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_IngredientToMonth";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SeasonMonth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IngredientToSeasonMonth" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_IngredientToSeasonMonth_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IngredientToSeasonMonth_B_fkey" FOREIGN KEY ("B") REFERENCES "SeasonMonth" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SeasonMonth_name_key" ON "SeasonMonth"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_IngredientToSeasonMonth_AB_unique" ON "_IngredientToSeasonMonth"("A", "B");

-- CreateIndex
CREATE INDEX "_IngredientToSeasonMonth_B_index" ON "_IngredientToSeasonMonth"("B");
