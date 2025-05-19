import { PrismaClient, Unit } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const volumeUnits = [
        { unit: Unit.TSP, ml: 5.0 },
        { unit: Unit.TBSP, ml: 15.0 },
        { unit: Unit.CUP, ml: 240.0 },
        { unit: Unit.PINCH, ml: 0.308058 },
        { unit: Unit.L, ml: 1000.0 },
        { unit: Unit.ML, ml: 1.0 }
    ];

    for (const { unit, ml } of volumeUnits) {
        await prisma.volumeUnit.upsert({
            where: { unit },
            update: { ml },
            create: { unit, ml },
        });
    }

    console.log('✅ Volume units seeded!');

    const seasonMonths = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
    ];

    for (const name of seasonMonths) {
        await prisma.seasonMonth.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log('✅ Season months seeded!');

    const categories = [
        "frühstück", "lunch/dinner", "snacks", "drinks",
        "one pot", "reis", "pasta", "bowls", "salads", "bread", "soup", "desserts", "backen", "diy condiments"
    ];

    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log("✅ Categories seeded!");

    const tags = [
        { name: "schnell", description: "kochen speedrun any%" },
        { name: "geringverdiener", description: "mehr als carbonara" },
        { name: "mealprep", description: "einmal kochen, dreimal faul sein" },
        { name: "clean", description: "damit du deine 30er noch erlebst" },
        { name: "boring", description: "für den highperformer dopamin detox day" },
        { name: "high protein", description: "hühnchen mit reis... du weißt schon" },
        { name: "gf approved", description: "meine freundin fand es 'nicht schlecht'" },
        { name: "süßkram", description: "du brauchst das nicht aber du willst es" },
        { name: "katerfrühstück", description: "fett, salz und mitleid" },
        { name: "food porn", description: "isst du mit den augen? schau hier" },
        { name: "vertrau mir bruder", description: "ich kann für nichts garantieren" },
    ];

    for (const tag of tags) {
        await prisma.tag.upsert({
            where: { name: tag.name },
            update: {},
            create: {
                name: tag.name,
                description: tag.description,
            },
        });
    }

    console.log("✅ Tags mit Beschreibungen seeded!");

    const appliances = [
        "backofen", "herd", "pürierstab", "mixer", "mikrowelle", "airfryer", "reiskocher", "toaster", "wasserkocher", "sandwichmaker", "kontaktgrill", "waffeleisen"
    ];

    for (const name of appliances) {
        await prisma.kitchenAppliance.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log("✅ Kitchen appliances seeded!");
}


main()
    .catch((e) => {
        console.error('❌ Error seeding volume units', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());