# Feedback Feature

Collects public beta feedback from authenticated users.

## Responsibilities

- Validate and submit user feedback by category
- Expose admin review inbox for content admins
- Support beta UX prompts (banner, settings, post-lesson)

## Dependencies

- Supabase `user_feedback` table (RLS)
- Analytics (`feedback_submitted` event on client submit)

## Usage

- User form: `/feedback` via `FeedbackForm`
- API: `POST /api/feedback`
- Admin: `/admin/content/feedback` via `GET/PATCH /api/admin/feedback`

## Known Limitations

- Admin inbox is read/update status only (no assignment or replies yet)
- Analytics is client-tracked after successful submit
