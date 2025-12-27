# UMAI Admin Interface

Production-grade admin interface for the UMAI preservation archive system.

## Features

- **Dashboard**: Overview of candidates, works, and system status
- **Candidate Review**: Triage queue with promote/watch/reject workflow
- **Work Evaluation**: Comprehensive rubric-based evaluation forms
- **Source Management**: Configure and adjust discovery sources
- **Mobile-Friendly**: Works on tablets and phones in desktop view

## Design Philosophy

Archival aesthetic inspired by preservation documentation:
- IBM Plex Mono for systematic data entry
- Crimson Pro serif for editorial content
- Grid patterns evoking archival storage
- Minimal color palette focused on content
- Distinctive typography avoiding generic SaaS aesthetics

## Prerequisites

- Supabase account with UMAI database deployed
- Node.js 18+ (for local development)
- Vercel account (for deployment)

## Setup Instructions

### 1. Create Admin User in Supabase

Before deploying the app, create your admin account:

**In Supabase Dashboard:**
1. Go to Authentication → Users
2. Click "Add user" 
3. Email: `kimberlydrath@gmail.com`
4. Create a strong password
5. Click "Create user"
6. Email will be auto-confirmed

The RLS policies you created will automatically grant this email full admin access.

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these from: Supabase Dashboard → Settings → API

### 2. Install Dependencies (Local Development)

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

Open http://localhost:3000 - you'll be redirected to login page.

Use the email/password you created in Supabase.

### 4. Deploy to Vercel

**Option A: Deploy from GitHub**

1. Push this code to GitHub
2. Go to vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

**Option B: Deploy from Local Folder**

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add environment variables when prompted

## Usage Guide

### Daily Workflow

**Morning Review (10 minutes):**
1. Open Dashboard
2. Check "New Candidates" count
3. Click into Candidates page
4. Review top-scored candidates
5. Actions:
   - **Promote**: Becomes a work for evaluation
   - **Watch**: Review again in 30 days
   - **Reject**: Remove from queue

**Weekly Evaluation (1-2 hours):**
1. Go to Works page
2. Filter by "In Progress"
3. Open each work
4. Fill in rubric scores (1-3 for each category)
5. Write descriptions
6. Add circulation/preservation notes
7. Write critical analysis
8. Click "Publish to Catalog"

### Rubric Scoring

Each category scored 1-3:
- **1**: Minimal/conventional
- **2**: Moderate/developing
- **3**: Significant/radical

**Categories:**
1. Narrative Innovation
2. Formal Experimentation
3. Institutional Exclusion
4. Preservation Urgency

Total possible: 12 points

### Source Management

Adjust quality weights based on performance:
- High-quality sources producing good candidates: +5 to +10
- Noisy sources producing irrelevant results: -5 to -10
- Disable completely broken sources

## Mobile Usage

Works on tablets and phones:
1. Enable "Desktop View" in your mobile browser
2. All features accessible
3. Form fields optimized for touch
4. Responsive tables

**Best on:**
- iPad with keyboard case
- Android tablets
- Large phones (6.5"+) in landscape

## Architecture

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with email/password
- **Authorization**: Row Level Security (RLS) policies
- **Styling**: Tailwind CSS with custom archival theme
- **Deployment**: Vercel (free tier)

## Security

**Multi-layer protection:**

1. **Login required**: All routes protected by middleware, redirects to login if not authenticated
2. **Session management**: Supabase handles secure session tokens
3. **Database-level security**: RLS policies enforce that only `kimberlydrath@gmail.com` can access admin data
4. **No sensitive keys exposed**: Only public anon key used client-side (safe by design)
5. **HTTPS enforced**: Vercel automatically provisions SSL certificates

**Even if someone bypasses the login UI**, they cannot access data because:
- RLS policies check the authenticated user's email
- Supabase rejects queries from unauthorized emails
- No API keys or secrets in the frontend code

To add additional admins:
1. Create user in Supabase Authentication
2. Update RLS policies to include their email
3. They can login with their credentials

## File Structure

```
umai-admin/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── candidates/
│   │   ├── page.tsx          # Candidates list
│   │   └── [id]/page.tsx     # Candidate detail
│   ├── works/
│   │   ├── page.tsx          # Works list
│   │   └── [id]/page.tsx     # Work editor
│   ├── sources/
│   │   └── page.tsx          # Sources management
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Archival design system
├── lib/
│   └── supabase.ts           # Database client & types
└── package.json
```

## Customization

### Colors

Edit `app/globals.css` to change the color scheme. Current palette:
- Stone grays for neutrality
- Minimal accent colors
- Focus on readability

### Fonts

Edit `app/layout.tsx` to change typography:
- Monospace: IBM Plex Mono (systematic data)
- Serif: Crimson Pro (editorial content)

### Rubric Fields

To modify rubric categories:
1. Update database schema in Supabase
2. Update `lib/supabase.ts` types
3. Update `app/works/[id]/page.tsx` form fields

## Troubleshooting

**"Cannot login" / "Invalid credentials"**
- Verify you created the user in Supabase Authentication
- Check email matches exactly: `kimberlydrath@gmail.com`
- Ensure user's email is confirmed
- Check Supabase Auth logs for specific error

**"Cannot connect to Supabase"**
- Verify environment variables are set
- Check Supabase project URL is correct
- Ensure RLS policies allow your email

**"No candidates appearing"**
- Collectors not deployed yet (normal at this stage)
- Check `discovery_sources` table has entries
- Manually insert test candidate to verify UI

**"Cannot save work"**
- Check browser console for errors
- Verify Supabase RLS policies
- Ensure you're logged in with the admin email

## Next Steps

After deploying the admin:
1. Deploy collector service (separate process)
2. Configure SerpAPI for search collectors
3. Test full pipeline: collector → candidate → work → publish
4. Build public catalog site

## Support

This is a custom-built interface. For issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify environment variables
4. Review database schema matches code

---

Built for systematic, research-oriented curation of unconventional media.
