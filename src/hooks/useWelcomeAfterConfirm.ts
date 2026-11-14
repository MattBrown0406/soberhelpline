import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { untypedSupabase } from "@/integrations/supabase/untyped";

// The welcome email waits until a new member has confirmed their email. For
// someone who joined on the one-page sign-up, that moment is the confirmation
// link signing them in here, so this asks the database to send it then.
//
// The database decides everything (claim_member_welcome): only for the
// signed-in person, only if their membership was created before they
// confirmed, and only once ever. This hook just knocks.

const RECENT_MS = 14 * 24 * 60 * 60 * 1000;
const asked = new Set<string>();

async function askOnce(user: User | null | undefined) {
  if (!user?.email_confirmed_at) return;
  const confirmedAt = new Date(user.email_confirmed_at).getTime();
  if (!Number.isFinite(confirmedAt) || Date.now() - confirmedAt > RECENT_MS) return;

  const key = `welcomeAsked:${user.id}`;
  if (asked.has(user.id)) return;
  try {
    if (localStorage.getItem(key)) return;
  } catch {
    // No storage: the in-memory set still stops repeats on this page.
  }
  asked.add(user.id);

  const { error } = await untypedSupabase.rpc("claim_member_welcome");
  if (error) {
    // Try again on a later page load.
    asked.delete(user.id);
    return;
  }
  try {
    localStorage.setItem(key, "1");
  } catch {
    // Not essential.
  }
}

export function useWelcomeAfterConfirm() {
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => askOnce(data.session?.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN") return;
      // Never call the client from inside its own auth callback.
      setTimeout(() => void askOnce(session?.user), 0);
    });
    return () => subscription.unsubscribe();
  }, []);
}
