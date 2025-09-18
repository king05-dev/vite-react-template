# MarineHub Manager - Marine Operations Dashboard

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

A comprehensive marine management platform built with modern web technologies. This application provides vessel tracking, crew management, maintenance scheduling, and operational analytics for marine operations.

![MarineHub Manager](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

<!-- dash-content-start -->

🌊 **MarineHub Manager** - Your complete marine operations solution:

## 🛠️ Tech Stack

### Frontend
- [**React 19**](https://react.dev/) - Modern UI library with latest features
- [**TypeScript**](https://www.typescriptlang.org/) - Type-safe development
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server
- [**React Router**](https://reactrouter.com/) - Client-side routing

### Backend & Infrastructure
- [**Hono**](https://hono.dev/) - Ultralight, modern backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform
- [**Supabase**](https://supabase.com/) - Backend-as-a-Service with PostgreSQL

### Database & Storage
- [**Supabase PostgreSQL**](https://supabase.com/database) - Managed PostgreSQL database
- [**DexieJS**](https://dexie.org/) - IndexedDB wrapper for offline functionality
- **IndexedDB** - Browser-based offline storage

### Authentication & Security
- [**Supabase Auth**](https://supabase.com/auth) - Complete authentication system
- **Row Level Security (RLS)** - Database-level security
- **JWT Tokens** - Secure session management

## ✨ Key Features

### 🔐 Authentication System
- **Secure Login/Registration** - Email-based authentication
- **Password Recovery** - Automated password reset flow
- **Protected Routes** - Route-level access control
- **Offline Authentication** - Cached user sessions

### 📊 Dashboard & Analytics
- **Real-time Dashboard** - Live operational metrics
- **Vessel Tracking** - GPS-based vessel monitoring
- **Weather Integration** - Current weather conditions
- **System Status** - Infrastructure health monitoring

### 🚢 Marine Operations
- **Vessel Management** - Complete vessel registry
- **Crew Management** - Staff scheduling and assignments
- **Maintenance Tracking** - Preventive maintenance scheduling
- **Logistics Coordination** - Supply chain management

### 💾 Offline Capabilities
- **Offline-First Design** - Works without internet connection
- **Data Synchronization** - Automatic sync when online
- **Cached Operations** - Local data storage with DexieJS
- **Background Sync** - Queue-based data synchronization

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach
- **Dark/Light Themes** - Customizable appearance
- **Intuitive Navigation** - Sidebar-based navigation
- **Real-time Updates** - Live data updates

Get started in minutes with local development or deploy directly via the Cloudflare dashboard. Perfect for marine operations requiring reliable, scalable, and offline-capable management systems.

<!-- dash-content-end -->

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd marinehub-nextjs/vite-react-template
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=MarineHub Manager
VITE_APP_VERSION=1.0.0
```

4. **Set up Supabase:**
   - Create a new Supabase project
   - Run the database migrations (see Database Setup section)
   - Configure authentication settings

### Development

Start the development server:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173)

### Database Setup

Create the following tables in your Supabase database:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run build && npm run deploy
```

Monitor your workers:

```bash
npx wrangler tail
```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
