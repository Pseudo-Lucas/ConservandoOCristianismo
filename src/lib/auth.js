import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from './db'

const COOKIE_NAME = 'cc_session'

function getSecret() {
  return process.env.SESSION_SECRET || 'dev-only-change-this-session-secret'
}

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

function sign(value) {
  return crypto
    .createHmac('sha256', getSecret())
    .update(value)
    .digest('base64url')
}

export function createSessionToken(user) {
  const payload = base64url(JSON.stringify({
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  }))

  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token) {
  if (!token) return null

  const [payload, signature] = token.split('.')
  if (!payload || !signature || sign(payload) !== signature) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!data.exp || data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

export async function setSessionCookie(user) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const session = verifySessionToken(cookieStore.get(COOKIE_NAME)?.value)

  if (!session?.userId) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, active: true },
  })

  if (!user?.active) return null
  return user
}

export async function requireEditor() {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  return user
}
