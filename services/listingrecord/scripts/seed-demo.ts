import {seedDemoData} from '../src/seed/demo-seed.ts';

const result = await seedDemoData();

console.log(`Seed complete: ${result.listingsCreated} listings created, ${result.productsCreated} products created.`);
