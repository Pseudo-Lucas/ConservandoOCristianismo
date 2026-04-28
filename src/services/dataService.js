/**
 * Data Service
 * Handles CRUD operations using localStorage.
 * Structured for easy future migration to a real backend/API.
 */

import articlesData from '../data/articles'
import booksData from '../data/books'
import downloadsData from '../data/downloads'

const KEYS = {
  articles: 'cc_articles',
  books: 'cc_books',
  downloads: 'cc_downloads',
}

// --- Initialization ---

function initializeStore(key, defaultData) {
  const stored = localStorage.getItem(key)
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultData))
    return defaultData
  }
  return JSON.parse(stored)
}

function getAll(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

function saveAll(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function generateId(items) {
  if (items.length === 0) return 1
  return Math.max(...items.map((i) => i.id)) + 1
}

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

// --- Articles ---

export const articleService = {
  init() {
    initializeStore(KEYS.articles, articlesData.map(a => ({
      ...a,
      status: 'published',
      imageUrl: '',
    })))
  },

  getAll() {
    return getAll(KEYS.articles)
  },

  getPublished() {
    return this.getAll().filter((a) => a.status === 'published')
  },

  getById(id) {
    return this.getAll().find((a) => a.id === id)
  },

  getBySlug(slug) {
    return this.getAll().find((a) => a.slug === slug && a.status === 'published')
  },

  create(article) {
    const items = this.getAll()
    const newArticle = {
      ...article,
      id: generateId(items),
      slug: generateSlug(article.title),
      date: article.date || new Date().toLocaleDateString('pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric'
      }),
    }
    items.unshift(newArticle)
    saveAll(KEYS.articles, items)
    return newArticle
  },

  update(id, updates) {
    const items = this.getAll()
    const index = items.findIndex((a) => a.id === id)
    if (index === -1) return null
    if (updates.title && updates.title !== items[index].title) {
      updates.slug = generateSlug(updates.title)
    }
    items[index] = { ...items[index], ...updates }
    saveAll(KEYS.articles, items)
    return items[index]
  },

  delete(id) {
    const items = this.getAll().filter((a) => a.id !== id)
    saveAll(KEYS.articles, items)
  },
}

// --- Books ---

export const bookService = {
  init() {
    initializeStore(KEYS.books, booksData.map(b => ({
      ...b,
      imageUrl: '',
      externalLink: '',
    })))
  },

  getAll() {
    return getAll(KEYS.books)
  },

  getById(id) {
    return this.getAll().find((b) => b.id === id)
  },

  create(book) {
    const items = this.getAll()
    const newBook = {
      ...book,
      id: generateId(items),
    }
    items.push(newBook)
    saveAll(KEYS.books, items)
    return newBook
  },

  update(id, updates) {
    const items = this.getAll()
    const index = items.findIndex((b) => b.id === id)
    if (index === -1) return null
    items[index] = { ...items[index], ...updates }
    saveAll(KEYS.books, items)
    return items[index]
  },

  delete(id) {
    const items = this.getAll().filter((b) => b.id !== id)
    saveAll(KEYS.books, items)
  },
}

// --- Downloads ---

export const downloadService = {
  init() {
    initializeStore(KEYS.downloads, downloadsData.map(d => ({
      ...d,
      fileUrl: '',
      category: 'Geral',
      published: true,
    })))
  },

  getAll() {
    return getAll(KEYS.downloads)
  },

  getPublished() {
    return this.getAll().filter((d) => d.published)
  },

  getById(id) {
    return this.getAll().find((d) => d.id === id)
  },

  create(item) {
    const items = this.getAll()
    const newItem = {
      ...item,
      id: generateId(items),
    }
    items.push(newItem)
    saveAll(KEYS.downloads, items)
    return newItem
  },

  update(id, updates) {
    const items = this.getAll()
    const index = items.findIndex((d) => d.id === id)
    if (index === -1) return null
    items[index] = { ...items[index], ...updates }
    saveAll(KEYS.downloads, items)
    return items[index]
  },

  delete(id) {
    const items = this.getAll().filter((d) => d.id !== id)
    saveAll(KEYS.downloads, items)
  },
}

// --- Initialize all stores ---
export function initializeDataStores() {
  articleService.init()
  bookService.init()
  downloadService.init()
}
