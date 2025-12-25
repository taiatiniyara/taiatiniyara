import { createClient } from '@supabase/supabase-js'

const required = (name) => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

const SUPABASE_URL = required('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = required('SUPABASE_SERVICE_ROLE_KEY')

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'taiatiniyara@gmail.com'
const ADMIN_PASSWORD = required('ADMIN_PASSWORD')
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME ?? 'Admin'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const ensureAdmin = async () => {
  // 1) Create (or fetch) auth user
  let user

  // Try create first; if email exists, fetch by email.
  const createRes = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: ADMIN_FULL_NAME },
  })

  if (createRes.error) {
    const msg = String(createRes.error.message ?? createRes.error)

    // Most common: "User already registered" / "email already exists"
    if (/already (registered|exists)/i.test(msg) || /duplicate/i.test(msg)) {
      const listRes = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
      if (listRes.error) throw listRes.error

      user = listRes.data.users.find((u) => (u.email ?? '').toLowerCase() === ADMIN_EMAIL.toLowerCase())
      if (!user) {
        throw new Error(
          `User exists but could not be found via listUsers(). Try increasing perPage or use Dashboard Auth to confirm the user.`,
        )
      }
    } else {
      throw createRes.error
    }
  } else {
    user = createRes.data.user
  }

  // 2) Upsert profile as admin
  const upsertRes = await supabase
    .from('user_profiles')
    .upsert(
      {
        id: user.id,
        email: ADMIN_EMAIL,
        full_name: ADMIN_FULL_NAME,
        role: 'admin',
      },
      { onConflict: 'id' },
    )
    .select('id,email,role')
    .single()

  if (upsertRes.error) throw upsertRes.error

  console.log('Admin seeded:', upsertRes.data)
}

ensureAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
