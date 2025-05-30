import express from "express";
import cors from "cors";
import { PrismaClient, IngredientType } from "@prisma/client";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/images", express.static("images"));

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

app.post("/api/recipes", async (req, res) => {
  const {
    title,
    description,
    image,
    servings,
    prepTime,
    waitTime,
    glutenFree,
    nutFree,
    soyFree,
    categoryIds,
    tagIds,
    applianceIds,
  } = req.body;

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        image,
        servings,
        prepTime,
        waitTime: waitTime ?? 0,
        glutenFree: glutenFree ?? false,
        nutFree: nutFree ?? false,
        soyFree: soyFree ?? false,
        categories: {
          connect: categoryIds?.map((id: number) => ({ id })) ?? [],
        },
        tags: {
          connect: tagIds?.map((id: number) => ({ id })) ?? [],
        },
        appliances: {
          connect: applianceIds?.map((id: number) => ({ id })) ?? [],
        },
        pricePerPortion: 0,
        kcalPerPortion: 0,
        carbsPerPortion: 0,
        fatPerPortion: 0,
        proteinPerPortion: 0,
      },
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error("❌ Fehler beim Anlegen des Rezepts:", error);
    res.status(500).json({ error: "Fehler beim Anlegen des Rezepts" });
  }
});

app.get("/api/enums/ingredient-type", (req, res) => {
  const types = Object.values(IngredientType);
  res.json(types);
});

app.get("/api/season-months", async (req, res) => {
  const months = await prisma.seasonMonth.findMany();
  res.json(months);
});

app.post("/api/ingredients", async (req, res) => {
  const {
    name,
    type,
    density,
    pricePer100g,
    kcalPer100g,
    carbsPer100g,
    fatPer100g,
    proteinPer100g,
    glutenFree,
    nutFree,
    soyFree,
    season,
  } = req.body;

  try {
    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        type,
        density,
        pricePer100g,
        kcalPer100g,
        carbsPer100g,
        fatPer100g,
        proteinPer100g,
        glutenFree,
        nutFree,
        soyFree,
        seasons: {
          connect: season?.map((id: number) => ({ id })) ?? [],
        },
      },
    });
    res.status(201).json(ingredient);
  } catch (error) {
    console.error("Fehler beim Anlegen:", error);
    res.status(500).json({ error: "Speichern fehlgeschlagen" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});



const storage = multer.diskStorage({
  destination: "images/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, "recipe-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const filePath = `/images/${req.file.filename}`;
  res.json({ url: filePath });
});

app.get("/api/categories", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

app.get("/api/tags", async (req, res) => {
  const tags = await prisma.tag.findMany();
  res.json(tags);
});

app.get("/api/appliances", async (req, res) => {
  const appliances = await prisma.kitchenAppliance.findMany();
  res.json(appliances);
});

app.listen(3000, () => {
  console.log("Server ready at http://localhost:3000");
});