# Code Break Arena

A competitive programming challenge platform built with React, TypeScript, and Supabase.

## Project Overview

Code Break Arena is a web-based platform for hosting competitive programming challenges. Participants can solve coding problems, track their progress, and compete on leaderboards.

## Features

- **Challenge System**: Multiple coding challenges with varying difficulty levels
- **Real-time Leaderboard**: Track participant rankings and scores
- **User Profiles**: Personal progress tracking and statistics
- **Admin Panel**: Comprehensive management tools for organizers
- **Certificate System**: Award certificates to participants
- **Event Management**: Control event status and settings

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom cyber-themed components
- **Backend**: Supabase (PostgreSQL database, authentication, storage)
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd code-break-arena
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions
├── pages/              # Main application pages
└── types/              # TypeScript type definitions
```

## Database Schema

The application uses Supabase with the following main tables:
- `profiles` - User information and roles
- `challenges` - Coding challenge definitions
- `challenge_progress` - User progress on challenges
- `user_summary` - Aggregated user statistics
- `certificates` - Certificate management
- `event_settings` - Global event configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.