import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return
  }

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

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
