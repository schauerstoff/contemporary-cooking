/*
  Warnings:

  - Made the column `carbsPer100g` on table `Ingredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `density` on table `Ingredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fatPer100g` on table `Ingredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kcalPer100g` on table `Ingredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pricePer100g` on table `Ingredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `proteinPer100g` on table `Ingredient` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingredient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "density" REAL NOT NULL,
    "pricePer100g" REAL NOT NULL,
    "kcalPer100g" REAL NOT NULL,
    "carbsPer100g" REAL NOT NULL,
    "fatPer100g" REAL NOT NULL,
    "proteinPer100g" REAL NOT NULL,
    "glutenFree" BOOLEAN NOT NULL,
    "nutFree" BOOLEAN NOT NULL,
    "soyFree" BOOLEAN NOT NULL
);
INSERT INTO "new_Ingredient" ("carbsPer100g", "density", "fatPer100g", "glutenFree", "id", "kcalPer100g", "name", "nutFree", "pricePer100g", "proteinPer100g", "soyFree", "type") SELECT "carbsPer100g", "density", "fatPer100g", "glutenFree", "id", "kcalPer100g", "name", "nutFree", "pricePer100g", "proteinPer100g", "soyFree", "type" FROM "Ingredient";
DROP TABLE "Ingredient";
ALTER TABLE "new_Ingredient" RENAME TO "Ingredient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
