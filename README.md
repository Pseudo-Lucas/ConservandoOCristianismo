# Conservando o Cristianismo

Site e painel editorial em Next.js, com backend proprio no mesmo projeto.

## Stack

- Next.js
- PostgreSQL
- Prisma
- Auth propria com senha hash e cookie httpOnly
- Vercel ou qualquer host Node compativel

## Variaveis de ambiente

Crie um `.env` local e configure as mesmas variaveis na Vercel:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/conservando"
SESSION_SECRET="troque-por-uma-frase-longa-e-aleatoria"
ADMIN_EMAIL="lucasg627@gmail.com"
ADMIN_PASSWORD="troque-esta-senha"
```

## Banco

Depois de configurar `DATABASE_URL`:

```powershell
npm run db:push
npm run db:seed
```

O seed cria o primeiro usuario editor usando `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

## Desenvolvimento

```powershell
npm install
npm run dev
```

## Deploy

Na Vercel, configure:

- `DATABASE_URL`
- `DIRECT_URL`
- `SESSION_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Depois rode o deploy normalmente. O build executa `prisma generate && next build`.
