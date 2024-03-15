import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const channels = {
  '1': 'Dimmer',
  '2': 'Dimmer fine',
  '3': 'Color Temp',
  '4': 'Color Temp fine',
  '5': 'Green/Magenta Point',
  '6': 'Green/Magenta Point fine',
  '7': 'Crossfade color',
  '8': 'Crossfade color fine',
  '9': 'Red intensity',
  '10': 'Red intensity fine',
  '11': 'Green intensity',
  '12': 'Green intensity fine',
  '13': 'Blue intensity',
  '14': 'Blue intensity fine',
  '15': 'White intensity',
  '16': 'White intensity fine',
  '17': 'Fan control',
  '18': 'Preset',
  '19': 'Strobe',
  '20': 'Reserved for future use',
};

async function main() {
  await prisma.fixture.create({
    data: {
      name: 'S60-c',
      manufacturerId: 1,
      notes: '4.4 engine',
    },
  });
  // await prisma.fixture.deleteMany({
  //   where: {
  //     id: {
  //       in: [2, 3, 4, 5],
  //     },
  //   },
  // });

  let result;
  try {
    result = await prisma.fixture.findMany({});
    console.dir({ result }, { depth: null });
  } catch (e) {
    console.log(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
