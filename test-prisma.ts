import prisma from './lib/db/prisma';

async function main() {
  try {
    const s = await prisma.subscriber.count();
    console.log("Subscribers:", s);
    const p = await prisma.post.findMany({ take: 1 });
    console.log("Posts:", p);
    console.log("Success");
  } catch(e) {
    console.error("Prisma Error:", e);
  } finally {
    process.exit(0);
  }
}
main();
