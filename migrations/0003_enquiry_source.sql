-- Additive only: the previous Worker keeps running if a deploy fails after this applies.
-- Where an enquiry came from, so I can see which pages and buttons bring real messages.
--   source:   the page or button that led to the form ("home", "offer-launch", "post:my-slug").
--   referrer: the site the visitor arrived from, or a utm_source, or "direct". Host name only, never a full URL.
ALTER TABLE enquiries ADD COLUMN source TEXT NOT NULL DEFAULT '';
ALTER TABLE enquiries ADD COLUMN referrer TEXT NOT NULL DEFAULT '';
