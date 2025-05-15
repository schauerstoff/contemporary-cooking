/*
  Warnings:

  - You are about to drop the column `time` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `displayGrams` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to alter the column `amountGram` on the `RecipeIngredient` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `glutenFree` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nutFree` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soyFree` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbsPerPortion` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatPerPortion` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `glutenFree` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kcalPerPortion` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nutFree` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prepTime` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerPortion` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proteinPerPortion` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soyFree` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountDisplayUnit` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayUnit` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "KitchenAppliance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Month" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stepNr" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,
    CONSTRAINT "RecipeStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VolumeUnit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "unit" TEXT NOT NULL,
    "ml" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "_RecipeToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RecipeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RecipeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RecipeIngredientToRecipeStep" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RecipeIngredientToRecipeStep_A_fkey" FOREIGN KEY ("A") REFERENCES "RecipeIngredient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RecipeIngredientToRecipeStep_B_fkey" FOREIGN KEY ("B") REFERENCES "RecipeStep" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_IngredientToMonth" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_IngredientToMonth_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IngredientToMonth_B_fkey" FOREIGN KEY ("B") REFERENCES "Month" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToRecipe" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_KitchenApplianceToRecipe" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_KitchenApplianceToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "KitchenAppliance" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_KitchenApplianceToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingredient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "density" REAL,
    "type" TEXT NOT NULL,
    "pricePer100g" REAL,
    "kcalPer100g" REAL,
    "carbsPer100g" REAL,
    "fatPer100g" REAL,
    "proteinPer100g" REAL,
    "glutenFree" BOOLEAN NOT NULL,
    "nutFree" BOOLEAN NOT NULL,
    "soyFree" BOOLEAN NOT NULL
);
INSERT INTO "new_Ingredient" ("density", "id", "name") SELECT "density", "id", "name" FROM "Ingredient";
DROP TABLE "Ingredient";
ALTER TABLE "new_Ingredient" RENAME TO "Ingredient";
CREATE TABLE "new_Recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,
    "servings" INTEGER NOT NULL,
    "prepTime" INTEGER NOT NULL,
    "waitTime" INTEGER NOT NULL DEFAULT 0,
    "pricePerPortion" REAL NOT NULL,
    "kcalPerPortion" REAL NOT NULL,
    "carbsPerPortion" REAL NOT NULL,
    "fatPerPortion" REAL NOT NULL,
    "proteinPerPortion" REAL NOT NULL,
    "glutenFree" BOOLEAN NOT NULL,
    "nutFree" BOOLEAN NOT NULL,
    "soyFree" BOOLEAN NOT NULL
);
INSERT INTO "new_Recipe" ("createdAt", "description", "id", "image", "servings", "title") SELECT "createdAt", "description", "id", "image", "servings", "title" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE TABLE "new_RecipeIngredient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipeId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "amountGram" REAL NOT NULL,
    "amountDisplayUnit" REAL NOT NULL,
    "displayUnit" TEXT NOT NULL,
    "comment" TEXT,
    CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RecipeIngredient" ("amountGram", "id", "ingredientId", "recipeId") SELECT "amountGram", "id", "ingredientId", "recipeId" FROM "RecipeIngredient";
DROP TABLE "RecipeIngredient";
ALTER TABLE "new_RecipeIngredient" RENAME TO "RecipeIngredient";
CREATE UNIQUE INDEX "RecipeIngredient_recipeId_ingredientId_key" ON "RecipeIngredient"("recipeId", "ingredientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KitchenAppliance_name_key" ON "KitchenAppliance"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Month_name_key" ON "Month"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VolumeUnit_unit_key" ON "VolumeUnit"("unit");

-- CreateIndex
CREATE UNIQUE INDEX "_RecipeToTag_AB_unique" ON "_RecipeToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_RecipeToTag_B_index" ON "_RecipeToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RecipeIngredientToRecipeStep_AB_unique" ON "_RecipeIngredientToRecipeStep"("A", "B");

-- CreateIndex
CREATE INDEX "_RecipeIngredientToRecipeStep_B_index" ON "_RecipeIngredientToRecipeStep"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IngredientToMonth_AB_unique" ON "_IngredientToMonth"("A", "B");

-- CreateIndex
CREATE INDEX "_IngredientToMonth_B_index" ON "_IngredientToMonth"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToRecipe_AB_unique" ON "_CategoryToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToRecipe_B_index" ON "_CategoryToRecipe"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KitchenApplianceToRecipe_AB_unique" ON "_KitchenApplianceToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_KitchenApplianceToRecipe_B_index" ON "_KitchenApplianceToRecipe"("B");
