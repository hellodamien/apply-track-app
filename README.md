# ApplyTrack - React Application

A React-based job application tracking application built with Vite, React Router, and TypeScript.

## Tech Stack

- **React 18.3** - UI library
- **Vite 6.4** - Build tool and dev server
- **React Router 6** - Client-side routing
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - UI components
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173/`

### Build

Build for production:

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
├── index.html              # Entry HTML file
├── src/
│   ├── main.tsx           # Application entry point
│   ├── App.tsx            # Main app component with routing
│   ├── globals.css        # Global styles
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── CompanyDetail.tsx
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── lib/              # Utilities and API functions
├── public/               # Static assets
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Key Features

- Job application tracking
- Company management
- Contact tracking
- Interaction history
- Follow-up reminders
- User authentication

## Routes

- `/` - Redirects to dashboard
- `/dashboard` - Main dashboard view
- `/login` - User login
- `/register` - User registration
- `/companies/:id` - Company detail view

## Migration from Next.js

This application was converted from Next.js to a standard React application:

- Removed Next.js dependencies
- Replaced Next.js routing with React Router
- Converted `app/` directory to `src/` structure
- Updated all navigation imports
- Removed server-side rendering features
- Configured Vite for optimal development experience

## Environment Variables

Create a `.env` file for environment-specific variables if needed.

## License

Private
