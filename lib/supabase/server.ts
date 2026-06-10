import { cache } from "react";

import { createClientUncached } from "@/lib/supabase/create-client-uncached";

export const createClient = cache(createClientUncached);
