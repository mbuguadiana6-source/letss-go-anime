import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

const SUPABASE_URL =
    "https://livxovjdwtmrrogzzusk.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_7yUayODU6IyME_H4u9sAkQ_ZE5GtXiM";


/* =====================================================
   CREATE CLIENT
===================================================== */

export const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


console.log("Supabase client initialized");