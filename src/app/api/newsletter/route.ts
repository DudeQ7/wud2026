import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
  lang: z.enum(["pl", "en", "de", "uk"]),
  consent: z.literal(true),
})

export async function POST(request: Request) {
  const result = signupSchema.safeParse(await request.json().catch(() => null))
  if (!result.success) return Response.json({ error: "Invalid signup" }, { status: 400 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return Response.json({ error: "Newsletter unavailable" }, { status: 503 })

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { error } = await supabase.rpc("subscribe_newsletter", {
      p_email: result.data.email,
      p_lang: result.data.lang,
      p_consent: result.data.consent,
    })
    if (error) {
      // Log only the error code, never the subscriber's address.
      console.error("Newsletter signup failed", error.code)
      return Response.json({ error: "Newsletter unavailable" }, { status: 503 })
    }
    return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return Response.json({ error: "Newsletter unavailable" }, { status: 503 })
  }
}
