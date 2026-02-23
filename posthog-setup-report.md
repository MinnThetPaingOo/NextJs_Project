<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your **DevEvent** Next.js App Router application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` — reducing the chance of tracking blockers intercepting requests. Four custom events are now captured across user-facing components, covering the full discovery journey from landing on the page to clicking an event card. Error tracking is enabled globally via `capture_exceptions: true`. Environment variables are stored in `.env.local` and never hardcoded.

| Event Name | Description | File |
|---|---|---|
| `featured_events_viewed` | Fires when the Featured Events section becomes visible in the viewport (IntersectionObserver) — top of the discovery funnel | `components/FeaturedEventsSectionTracker.tsx` |
| `explore_events_clicked` | Fires when a user clicks the "Explore Events" hero button to scroll to the events list | `components/ExploreBtn.tsx` |
| `event_card_clicked` | Fires when a user clicks an event card, with properties: `event_title`, `event_slug`, `event_location`, `event_date` | `components/EventCard.tsx` |
| `nav_link_clicked` | Fires when a user clicks any navbar link (Home, Events, Create Event, Logo), with property: `link_label` | `components/Navbar.tsx` |

### Files created or modified

| File | Change |
|---|---|
| `instrumentation-client.ts` | **Created** — initializes PostHog client-side with error tracking and debug mode |
| `next.config.ts` | **Modified** — added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect` |
| `components/ExploreBtn.tsx` | **Modified** — added `explore_events_clicked` capture in click handler |
| `components/EventCard.tsx` | **Modified** — added `'use client'` directive and `event_card_clicked` capture with event properties |
| `components/Navbar.tsx` | **Modified** — added `'use client'` directive and `nav_link_clicked` capture per link |
| `components/FeaturedEventsSectionTracker.tsx` | **Created** — client component using IntersectionObserver to fire `featured_events_viewed` |
| `app/page.tsx` | **Modified** — imported and rendered `FeaturedEventsSectionTracker` |
| `.env.local` | **Created** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set (covered by .gitignore) |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics**: https://us.posthog.com/project/321488/dashboard/1301463
- 🔻 **Event Discovery Funnel** (featured_events_viewed → explore_events_clicked → event_card_clicked): https://us.posthog.com/project/321488/insights/zaHvdh8F
- 📈 **Explore & Event Card Clicks Over Time** (daily trend): https://us.posthog.com/project/321488/insights/H2VY6W1F
- 📊 **Top Navigation Links Clicked** (bar chart of all CTAs): https://us.posthog.com/project/321488/insights/DmdWjjta
- 👤 **Daily Active Users (Unique)**: https://us.posthog.com/project/321488/insights/ZY7i81qD
- 👁️ **Featured Events Section Reach** (funnel entry point): https://us.posthog.com/project/321488/insights/lo1lWq01

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
