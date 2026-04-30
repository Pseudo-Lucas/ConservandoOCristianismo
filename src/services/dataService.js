import { requireSupabase } from '../lib/supabaseClient'

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function formatDate() {
  return new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function withoutUndefined(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  )
}

function toCamelArticle(article) {
  if (!article) return null
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    date: article.date,
    author: article.author,
    category: article.category,
    excerpt: article.excerpt,
    content: article.content,
    status: article.status,
    imageUrl: article.image_url || '',
    createdAt: article.created_at,
  }
}

function toSnakeArticle(article) {
  return withoutUndefined({
    title: article.title,
    slug: article.slug,
    date: article.date,
    author: article.author,
    category: article.category,
    excerpt: article.excerpt,
    content: article.content,
    status: article.status,
    image_url: article.imageUrl === undefined ? undefined : article.imageUrl || null,
  })
}

function toCamelBook(book) {
  if (!book) return null
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    imageUrl: book.image_url || '',
    externalLink: book.external_link || '',
    createdAt: book.created_at,
  }
}

function toSnakeBook(book) {
  return withoutUndefined({
    title: book.title,
    author: book.author,
    description: book.description,
    image_url: book.imageUrl === undefined ? undefined : book.imageUrl || null,
    external_link: book.externalLink === undefined ? undefined : book.externalLink || null,
  })
}

function toCamelDownload(item) {
  if (!item) return null
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    fileUrl: item.file_url || '',
    category: item.category,
    published: item.published,
    createdAt: item.created_at,
  }
}

function toSnakeDownload(item) {
  return withoutUndefined({
    name: item.name,
    description: item.description,
    file_url: item.fileUrl === undefined ? undefined : item.fileUrl || null,
    category: item.category,
    published: item.published,
  })
}

function throwIfError(error) {
  if (error) throw error
}

export const articleService = {
  async getAll() {
    const { data, error } = await requireSupabase()
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    throwIfError(error)
    return data.map(toCamelArticle)
  },

  async getPublished() {
    const { data, error } = await requireSupabase()
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    throwIfError(error)
    return data.map(toCamelArticle)
  },

  async getById(id) {
    const { data, error } = await requireSupabase()
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
    throwIfError(error)
    return toCamelArticle(data)
  },

  async getBySlug(slug) {
    const { data, error } = await requireSupabase()
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error?.code === 'PGRST116') return null
    throwIfError(error)
    return toCamelArticle(data)
  },

  async create(article) {
    const payload = toSnakeArticle({
      ...article,
      slug: generateSlug(article.title),
      date: article.date || formatDate(),
    })
    const { data, error } = await requireSupabase()
      .from('articles')
      .insert(payload)
      .select()
      .single()
    throwIfError(error)
    return toCamelArticle(data)
  },

  async update(id, updates) {
    const payload = { ...updates }
    if (updates.title) payload.slug = generateSlug(updates.title)

    const { data, error } = await requireSupabase()
      .from('articles')
      .update(toSnakeArticle(payload))
      .eq('id', id)
      .select()
      .single()
    throwIfError(error)
    return toCamelArticle(data)
  },

  async delete(id) {
    const { error } = await requireSupabase()
      .from('articles')
      .delete()
      .eq('id', id)
    throwIfError(error)
  },
}

export const bookService = {
  async getAll() {
    const { data, error } = await requireSupabase()
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false })
    throwIfError(error)
    return data.map(toCamelBook)
  },

  async create(book) {
    const { data, error } = await requireSupabase()
      .from('recommendations')
      .insert(toSnakeBook(book))
      .select()
      .single()
    throwIfError(error)
    return toCamelBook(data)
  },

  async update(id, updates) {
    const { data, error } = await requireSupabase()
      .from('recommendations')
      .update(toSnakeBook(updates))
      .eq('id', id)
      .select()
      .single()
    throwIfError(error)
    return toCamelBook(data)
  },

  async delete(id) {
    const { error } = await requireSupabase()
      .from('recommendations')
      .delete()
      .eq('id', id)
    throwIfError(error)
  },
}

export const downloadService = {
  async getAll() {
    const { data, error } = await requireSupabase()
      .from('downloads')
      .select('*')
      .order('created_at', { ascending: false })
    throwIfError(error)
    return data.map(toCamelDownload)
  },

  async getPublished() {
    const { data, error } = await requireSupabase()
      .from('downloads')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    throwIfError(error)
    return data.map(toCamelDownload)
  },

  async create(item) {
    const { data, error } = await requireSupabase()
      .from('downloads')
      .insert(toSnakeDownload(item))
      .select()
      .single()
    throwIfError(error)
    return toCamelDownload(data)
  },

  async update(id, updates) {
    const { data, error } = await requireSupabase()
      .from('downloads')
      .update(toSnakeDownload(updates))
      .eq('id', id)
      .select()
      .single()
    throwIfError(error)
    return toCamelDownload(data)
  },

  async delete(id) {
    const { error } = await requireSupabase()
      .from('downloads')
      .delete()
      .eq('id', id)
    throwIfError(error)
  },
}

export const contactService = {
  async create(message) {
    const { data, error } = await requireSupabase()
      .from('contact_messages')
      .insert({
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
      })
      .select()
      .single()
    throwIfError(error)
    return data
  },
}
