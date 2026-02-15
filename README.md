# ⚡ Stepwise

**Transform static screenshots into interactive product demos**

Create engaging, clickable walkthroughs without video editing. Add hotspots, tooltips, and guided navigation flows in minutes.

---

## 🌟 Features

### 🎯 Interactive Demo Builder
- **Upload Screenshots** - Drag and drop images to create demo steps
- **Smart Hotspots** - Draw clickable areas with custom colors, borders, and actions
- **Intelligent Tooltips** - Add contextual help with smart positioning (no more cut-off text!)
- **Navigation Flow** - Link hotspots to create guided step-by-step experiences
- **Auto-Navigation** - Generate prev/next buttons automatically

### 🎨 Beautiful UI/UX
- **Linear-inspired Design** - Clean, modern interface with high information density
- **Airbnb-style Search** - Unified search bar with smart filters and sorting
- **Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Ready** - Coming soon

### 🚀 Sharing & Embedding
- **Public/Private Demos** - Control visibility with a single toggle
- **Unique URLs** - Share with clean, memorable slugs (`/demo/product-tour`)
- **Embed Support** - Coming soon

### 🔒 Authentication & Storage
- **Secure Auth** - JWT-based authentication via Supabase
- **Image Storage** - Reliable uploads with UploadThing
- **PostgreSQL Database** - Fast, scalable data storage with Drizzle ORM

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui + Radix UI |
| **Animations** | Framer Motion |
| **Auth** | Supabase Auth + JWT |
| **Database** | PostgreSQL (via Supabase) |
| **ORM** | Drizzle ORM |
| **File Storage** | UploadThing |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **State** | Zustand |
| **Deployment** | Vercel |

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 20.x or higher
- **npm** or **pnpm** (package manager)
- **PostgreSQL** database (Supabase recommended)
- **Supabase** project for auth and database

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd stepwise
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_PROJECT_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROJECT_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_chars
```

> **🔐 Security Note:** Never commit your `.env` file to version control!

### 4. Set Up the Database

Run database migrations:

```bash
npx drizzle-kit push
```

### 5. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 📁 Project Structure

```
stepwise/
├── app/                    # Next.js 16 App Router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── (protected)/       # Protected routes (dashboard, demos)
│   ├── demo/              # Public demo viewer
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── demo/              # Demo viewer components
│   ├── landing/           # Landing page components
│   └── ui/                # shadcn/ui components
├── actions/               # Server actions (API layer)
├── db/                    # Database schema & migrations
├── context/               # React context providers
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

---

## 🎯 How to Use

### Creating Your First Demo

1. **Sign Up** - Create an account at `/register`
2. **New Demo** - Click "New demo" on the dashboard
3. **Add Steps** - Upload screenshots for each step
4. **Draw Hotspots** - Click "Draw Hotspot" and drag on your screenshots
5. **Add Tooltips** - Describe what users should do at each hotspot
6. **Link Steps** - Connect hotspots to navigate between steps
7. **Share** - Toggle "Public" and share your demo URL!

### Keyboard Shortcuts

- `Esc` - Cancel hotspot drawing
- `Delete` - Remove selected hotspot
- `Enter` - Save hotspot edits

---

## 🎨 Design System

### Colors

The app uses a vibrant **Indigo (#4F46E5)** as the primary brand color, with a refined neutral palette:

- **Primary:** `#4F46E5` (Indigo)
- **Background:** `#FAFAFA` (Light gray)
- **Text Primary:** `#0A0A0A` (Near black)
- **Text Secondary:** `#525252` (Medium gray)
- **Border:** `#E5E5E5` (Light gray)

### Typography

- **Headings:** Space Grotesk (600 weight)
- **Body:** Inter (400/500 weight)
- **Code:** SF Mono / Fira Code

---

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx drizzle-kit push` | Push database schema changes |
| `npx drizzle-kit studio` | Open Drizzle Studio (DB GUI) |

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy! 🚀

### Environment Variables for Production

Make sure to add all `.env` variables to your Vercel project settings under **Settings → Environment Variables**.

---

## 🗺️ Roadmap

- [x] Core demo builder with hotspots
- [x] Smart tooltip positioning
- [x] Airbnb-style search & filters
- [x] Public/private demo sharing
- [x] Responsive design (mobile, tablet, desktop)
- [ ] Drag-and-drop step reordering
- [ ] Embed code generation
- [ ] Analytics dashboard
- [ ] Dark mode
- [ ] Keyboard navigation
- [ ] Demo templates
- [ ] Team collaboration
- [ ] Custom branding

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Supabase](https://supabase.com/) - Backend as a service
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [UploadThing](https://uploadthing.com/) - File uploads made easy
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library

---

**Built with ❤️ using modern web technologies**
