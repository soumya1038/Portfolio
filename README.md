# P-Folio

Build a portfolio that looks premium, loads fast, and tells your story in seconds.

![Hero banner](assets/hero.png)

## The Short Pitch
P-Folio is a clean, conversion-focused portfolio experience designed to win attention quickly and keep it. Show your work, prove impact, and make it effortless for people to contact you.

## Why It Works
- Clear narrative that highlights results, not just tasks.
- Elegant layouts that keep projects and skills easy to scan.
- Fast, lightweight pages that feel professional on any device.
- Built-in structure for testimonials, case studies, and contact CTAs.

## What You Can Showcase
- Projects with outcomes, tools used, and your exact role.
- Case studies with before-and-after impact.
- Awards, certifications, and featured mentions.
- Services, availability, and engagement options.

## Designed For
- Developers and engineers
- Designers and product builders
- Freelancers and consultants
- Students and early-career professionals

## Highlights
- Beautiful, minimal layout that puts your work first.
- Sections that guide visitors from curiosity to contact.
- Space for custom branding and personal voice.
- Ready for hiring managers, clients, and collaborators.

## Gallery

![Projects overview](assets/projects.png)
![Project gallery](assets/gallery.png)
![Project detail](assets/project%20details.png)
![Achievements](assets/achievements.png)

## Contact Preview
![Contact section](assets/contacts.png)

## Get Started
1. Add your content and update section copy to match your voice.
2. Drop your images into `assets/`.
3. Replace any image with your own by updating the path.
4. Share your link and start getting replies.

## Swap Images
Use this pattern to replace images with your own:

```md
![Short descriptive alt text](assets/your-image.png)
```

## Contact
Ready to collaborate or hire? Add your email, scheduling link, and social profiles here.

## Render Keep-Awake (Toggle Controlled)
This project includes a Render cron service (`p-folio-keep-awake`) that runs every 10 minutes.

- The cron job reads `ownerSettings.keepServerAwake` from MongoDB.
- If toggle is `ON`, it pings your server `/health` endpoint.
- If toggle is `OFF`, it skips pinging, so the server can sleep.

Set these env vars on the cron service:

- `MONGODB_URI`: same database used by your API service
- `KEEP_AWAKE_TARGET_URL`: auto-wired from `p-folio-server` host by `render.yaml` (or set manually if needed)
