'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { clearSessionCookie, requireEditor } from '../lib/auth'
import { prisma } from '../lib/db'
import { slugify } from '../lib/slug'

export async function logoutAction() {
  await clearSessionCookie()
  redirect('/')
}

export async function createContactMessage(formData) {
  await prisma.contactMessage.create({
    data: {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      subject: String(formData.get('subject') || ''),
      message: String(formData.get('message') || ''),
    },
  })

  return { ok: true, message: 'Mensagem enviada com sucesso.' }
}

export async function saveArticle(formData) {
  await requireEditor()

  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '')
  const content = String(formData.get('content') || '')
  const status = String(formData.get('status') || 'draft')

  const data = {
    title,
    slug: slugify(title),
    author: String(formData.get('author') || 'Lucas Gomes'),
    category: String(formData.get('category') || 'Teologia'),
    date: String(formData.get('date') || ''),
    imageUrl: String(formData.get('imageUrl') || '') || null,
    content,
    status,
    excerpt: String(formData.get('excerpt') || content.replace(/<[^>]*>/g, '').slice(0, 180)),
  }

  if (id) {
    await prisma.article.update({ where: { id }, data })
  } else {
    await prisma.article.create({ data })
  }

  revalidatePath('/')
  revalidatePath('/artigos')
  redirect('/admin/artigos')
}

export async function deleteArticle(formData) {
  await requireEditor()
  await prisma.article.delete({ where: { id: String(formData.get('id')) } })
  revalidatePath('/admin/artigos')
}

export async function saveRecommendation(formData) {
  await requireEditor()
  const id = String(formData.get('id') || '')
  const data = {
    title: String(formData.get('title') || ''),
    author: String(formData.get('author') || ''),
    description: String(formData.get('description') || ''),
    imageUrl: String(formData.get('imageUrl') || '') || null,
    externalLink: String(formData.get('externalLink') || '') || null,
  }

  if (id) await prisma.recommendation.update({ where: { id }, data })
  else await prisma.recommendation.create({ data })

  revalidatePath('/recomendacoes')
  redirect('/admin/recomendacoes')
}

export async function deleteRecommendation(formData) {
  await requireEditor()
  await prisma.recommendation.delete({ where: { id: String(formData.get('id')) } })
  revalidatePath('/admin/recomendacoes')
}

export async function saveDownload(formData) {
  await requireEditor()
  const id = String(formData.get('id') || '')
  const data = {
    name: String(formData.get('name') || ''),
    description: String(formData.get('description') || ''),
    fileUrl: String(formData.get('fileUrl') || '') || null,
    category: String(formData.get('category') || 'Geral'),
    published: formData.get('published') === 'on',
  }

  if (id) await prisma.download.update({ where: { id }, data })
  else await prisma.download.create({ data })

  revalidatePath('/downloads')
  redirect('/admin/downloads')
}

export async function deleteDownload(formData) {
  await requireEditor()
  await prisma.download.delete({ where: { id: String(formData.get('id')) } })
  revalidatePath('/admin/downloads')
}

export async function createUser(formData) {
  await requireEditor()
  const email = String(formData.get('email') || '').toLowerCase()
  const password = String(formData.get('password') || '')
  const name = String(formData.get('name') || '')

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'editor',
      active: true,
    },
  })

  redirect('/admin/usuarios')
}
