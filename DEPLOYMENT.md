# Deployment Note for Vercel

## Local run
1. Install Node.js 18+.
2. Open the project folder:
   `d:\my_work\PortFolio\react-portfolio`
3. Install dependencies:
   `npm install`
4. Run the app locally:
   `npm run dev`
5. Build for production:
   `npm run build`

## Upload to GitHub
1. Create a new repository on GitHub.
2. From the project folder, initialize Git if needed and push the code to the repository.
3. Make sure these files are committed:
   - `package.json`
   - `index.html`
   - `vite.config.js`
   - `src/App.jsx`
   - `src/main.jsx`
   - `src/styles.css`
   - `DEPLOYMENT.md`

## Deploy on Vercel
1. Go to https://vercel.com.
2. Sign in with GitHub.
3. Click **Add New Project**.
4. Import the GitHub repository.
5. Vercel usually detects Vite automatically.
6. Keep these build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Click **Deploy**.

## Connect the project to the portfolio domain
1. Open the project in Vercel.
2. Go to **Settings** > **Domains**.
3. Add your domain or subdomain.
4. If you use a custom domain, update the DNS records at your domain provider according to Vercel instructions.
5. Wait for DNS propagation, then verify the live link.

## Recommended workflow
- Push changes to GitHub.
- Vercel will auto-deploy every time you push to the connected branch.
- Use the `main` branch as the production branch.
