# Portfolio content update

The public portfolio reads its content from MongoDB. The frontend `initialData.js` file is only a fallback for API failures, and `portfolio-backend/defaultData.js` is used only when seeding an empty database.

## Safe content synchronization

`npm run portfolio:sync` performs a read-only dry run against the database selected by the backend's untracked `.env`. It reports the intended project order and whether the current resume URL, avatar, and project images will be preserved.

After backing up the selected MongoDB database and verifying the dry-run output, `npm run portfolio:sync:apply` updates the professional copy. The operation is idempotent: it matches the three featured projects by title, preserves their MongoDB `_id` values and images, retains unmatched projects, and preserves the current phone, resume URL, and avatar.

The command is never run automatically during deployment. Confirm `MONGODB_URI` points to the intended environment before applying it.

## Resume asset

No resume PDF is tracked under `portfolio-fronend/public/`. The current CMS record points to an external Google Drive file, whose contents and currency cannot be verified from the repository. Supply the approved current PDF before changing the action to a repository-hosted download. A future local asset should use a stable path such as `/Mahmoud-Abozahra-Resume.pdf`, and the CMS `resumeUrl` should be updated to that path only after the file is added.
