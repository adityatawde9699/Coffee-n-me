import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      name: "Editorial Team",
      email: "editorial@coffeenme.com",
      role: "ADMIN",
    },
  });

  // Create Categories
  const essays = await prisma.category.create({
    data: { name: "Essays", slug: "essays" },
  });
  const tech = await prisma.category.create({
    data: { name: "Technology", slug: "tech" },
  });

  // Create Featured Post
  await prisma.post.create({
    data: {
      title: "The Quiet Revolution of Digital Minimalism",
      slug: "digital-minimalism",
      content: "Full content of the essay about minimalism...",
      excerpt: "Why doing less in the digital age is the most radical thing you can do for your focus and creativity.",
      published: true,
      featured: true,
      authorId: admin.id,
      categoryId: essays.id,
      readingTime: 8,
      publishedAt: new Date(),
    },
  });

  // Create some latest posts
  await prisma.post.create({
    data: {
      title: "Building for the Modern Web in 2026",
      slug: "modern-web-2026",
      content: "The web has changed...",
      excerpt: "Exploring the shift from client-side complexity to server-side elegance with Next.js 15.",
      published: true,
      authorId: admin.id,
      categoryId: tech.id,
      readingTime: 5,
      publishedAt: new Date(Date.now() - 86400000), // 1 day ago
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
