# Server (Supabase)

Project `mobile-karkarde` (region eu-central-1). The site talks to it from `src/shared/api/supabase.ts`.

| What | Where |
|---|---|
| Login, email codes (edge function) | `supabase/functions/auth/index.ts` |
| Tables | `staff` (admin / کارشناس, code stored hashed), `listings`, `listing_photos`, `account_security` (email + password hash + two-step), `email_codes`, `login_challenges`, `login_attempts` |
| Photos | private storage bucket `listing-photos` (path `<listing id>/<slot>.jpg`) |
| Public list | view `published_products` (no owner; price only for signed-in partners) |
| Rules | row level security on every table; changes go through functions (`review_listing`, `add_staff`, `set_email_login`, …) that check the caller |

Secrets on the edge function: `BIRD_API_KEY` (a Bird workspace key with only the `emails:write` scope), `PARTNER_CODE` (the shared partner test code until real SMS is connected: set your own value, and never print it on the site) and `MAIL_FROM`.

Email is sent from `mail.mobilekarkarde.ir` (domain verified in Bird; DNS records live in Cloudflare).
