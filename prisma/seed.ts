import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create muscle groups
    const chest = await prisma.muscleGroup.create({
        data: {
            name: 'Chest',
            description: 'Chest muscles group',
        },
    });

    const back = await prisma.muscleGroup.create({
        data: {
            name: 'Back',
            description: 'Back muscles group',
        },
    });

    // Create exercises
    await prisma.exercise.create({
        data: {
            name: 'Bench Press',
            description: 'Barbell bench press',
            exerciseLogType: 1,
            muscleGroupId: chest.id,
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
