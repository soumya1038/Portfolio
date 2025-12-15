# Portfolio Website

A modern, interactive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Features

✨ **Modern Design** - Eye-catching gradient colors and smooth animations
🎨 **Fully Editable** - Edit your portfolio content directly on the website
📱 **Responsive** - Beautiful on all devices (mobile, tablet, desktop)
⚡ **Fast** - Built with Next.js for optimal performance
🚀 **Easy to Deploy** - Ready for Netlify deployment

## Sections

- **Hero Section** - Stunning introduction with call-to-action buttons
- **About Section** - Tell your story with statistics
- **Projects Section** - Showcase your best work with descriptions and technologies
- **Skills Section** - Display your technical expertise
- **Contact Section** - Social links and contact options
- **Edit Panel** - Built-in editing interface (click "Edit" button in navbar)

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Editing Your Portfolio

Click the **"Edit"** button in the top-right corner of the navbar to open the edit panel. You can update:
- Your name and professional title
- Your bio/about section
- Email address
- Social media links (GitHub, LinkedIn, Twitter)
- Skills

Changes are saved locally in your browser's localStorage and persist across sessions.

## Building for Production

```bash
npm run build
npm start
```

## Deploying to Netlify

### Method 1: Using Netlify CLI

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=.next
```

### Method 2: Using Netlify UI

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build command to: `npm run build`
6. Set publish directory to: `.next`
7. Deploy!

## Customization

### Colors
Edit the colors in [tailwind.config.ts](tailwind.config.ts):
```typescript
colors: {
  primary: '#6366f1',    // Indigo
  secondary: '#ec4899',  // Pink
  accent: '#f59e0b',     // Amber
}
```

### Data
Edit your portfolio data in [src/data/portfolio.ts](src/data/portfolio.ts)

### Components
All components are in [src/components](src/components) and are fully customizable

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx         # Main portfolio page
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── EditPanel.tsx
│   └── data/
│       └── portfolio.ts     # Portfolio content
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Tips & Tricks

- **Add More Projects**: Edit the `projects` array in [src/data/portfolio.ts](src/data/portfolio.ts)
- **Change Fonts**: Modify the font settings in [src/app/globals.css](src/app/globals.css)
- **Update Colors**: Edit the gradient colors in each component or the Tailwind config
- **Add New Sections**: Create new components in `src/components` and import them in `page.tsx`

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React** - UI library

## License

Free to use for personal and commercial projects.

## Support

If you have questions or issues, feel free to ask!
