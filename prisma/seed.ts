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
}

main()
    .catch((e) => {
        console.error('❌ Error seeding volume units', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());