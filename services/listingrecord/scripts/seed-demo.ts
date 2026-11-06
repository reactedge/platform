import {seedDemoData} from '../src/seed/demo-seed.ts';

const result = await seedDemoData();

// eslint-disable-next-line no-console -- Demo seeding POC; report the result in the terminal.
console.log(`Seed complete: ${result.listingsCreated} listings created, ${result.productsCreated} products created.`);
