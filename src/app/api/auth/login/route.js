import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { setSessionCookie } from '../../../../lib/auth'
import { prisma } from '../../../../lib/db'

export async function POST(request) {
  const { email, password } = await request.json()
  const user = await prisma.user.findUnique({
    where: { email: String(email || '').toLowerCase() },
  })

  if (!user?.active) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 })
  }

  const valid = await bcrypt.compare(String(password || ''), user.passwordHash)

  if (!valid) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 })
  }

  await setSessionCookie(user)
  return NextResponse.json({ ok: true })
}
