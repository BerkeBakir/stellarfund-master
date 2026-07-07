# Feedback responses

Real user feedback collected via the in-app Google Form (wallet + email + name + rating +
comment) and the feedback widget.

## How to update

1. Open the Google Form → **Responses** → **Link to Sheets** (or **Download CSV**).
2. Save the export here as `responses.csv` (this folder is the single source of truth).
3. The app parses it with `parseFeedbackCsv` (`src/lib/feedback-import.ts`) for the
   testimonial wall and the growth report's feedback summary.
4. When a response drives a product change, link the fix commit in the app README's
   **Feedback-driven improvements** section and on `/changelog`.

Only include **real, consented** responses. `responses.sample.csv` shows the expected shape
(placeholder data — not real users).
