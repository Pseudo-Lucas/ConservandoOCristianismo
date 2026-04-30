import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (adminEmail && adminPassword) {
    await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: {
        passwordHash: await bcrypt.hash(adminPassword, 12),
        active: true,
        role: 'editor',
      },
      create: {
        email: adminEmail.toLowerCase(),
        name: 'Lucas Gomes',
        passwordHash: await bcrypt.hash(adminPassword, 12),
        role: 'editor',
        active: true,
      },
    })
  }

  const articles = [
    ['A Soberania de Deus na Historia', 'Teologia', 'Uma reflexao sobre a providencia divina na historia humana.'],
    ['A Importancia da Educacao Classica para o Cristao', 'Educacao Classica', 'Por que recuperar o Trivium e a tradicao das artes liberais.'],
    ['Filosofia Crista e o Pensamento Moderno', 'Filosofia', 'Como a filosofia crista responde aos dilemas modernos.'],
  ]

  for (const [title, category, excerpt] of articles) {
    await prisma.article.upsert({
      where: { slug: slugify(title) },
      update: {},
      create: {
        slug: slugify(title),
        title,
        category,
        excerpt,
        author: 'Lucas Gomes',
        date: '30 de abril de 2026',
        status: 'published',
        content: `<p>${excerpt}</p>`,
      },
    })
  }

  await prisma.recommendation.createMany({
    data: [
      { title: 'Confissoes', author: 'Santo Agostinho', description: 'Uma das maiores obras da literatura crista.' },
      { title: 'Institutas da Religiao Crista', author: 'Joao Calvino', description: 'A obra-prima da teologia reformada.' },
      { title: 'Ortodoxia', author: 'G.K. Chesterton', description: 'Uma defesa brilhante do cristianismo ortodoxo.' },
    ],
    skipDuplicates: true,
  })

  await prisma.download.createMany({
    data: [
      { name: 'Guia de Leitura dos Pais da Igreja', description: 'Roteiro introdutorio para leitura patristica.', category: 'Teologia' },
      { name: 'Introducao ao Trivium', description: 'Material sobre Gramatica, Logica e Retorica.', category: 'Educacao Classica' },
    ],
    skipDuplicates: true,
  })
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
