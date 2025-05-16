import express from "express";
import cors from "cors";
import { PrismaClient, IngredientType } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/recipes", async (req, res) => {
  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
  res.json(recipes);
});

app.get("/recipes/:id", async (req, res) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
  if (!recipe) return res.status(404).json({ error: "Not found" });
  res.json(recipe);
});

app.get("/api/enums/ingredient-type", (req, res) => {
  const types = Object.values(IngredientType);
  res.json(types);
});

app.get("/api/season-months", async (req, res) => {
  const months = await prisma.seasonMonth.findMany();
  res.json(months);
});

app.listen(3000, () => {
  console.log("Server ready at http://localhost:3000");
});