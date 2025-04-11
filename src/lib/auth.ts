import type { AstroGlobal } from "astro";

export async function getUser(Astro: AstroGlobal) {
  const session = await Astro.locals.supabase.auth.getSession();
  return session?.data.session?.user ?? null;
}
