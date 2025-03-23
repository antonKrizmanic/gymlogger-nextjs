# GymNotebook

GymNotebook is a comprehensive web application designed to help fitness enthusiasts track and manage their workout routines. Whether you're a beginner or an experienced gym-goer, GymNotebook provides the tools to log exercises, monitor progress, and achieve your fitness goals.

## 🏋️ Overview

GymNotebook allows users to:
- Create and manage workout routines
- Track exercises by sets, reps, and weight
- Organize workouts by muscle groups
- Monitor progress over time
- View detailed workout history

## 🛠️ Technology Stack

This application is built with modern web technologies:

- **Frontend & Backend**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: [Auth.js 5 (beta)](https://authjs.dev/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Development Assistance**: Cursor/Copilog/v0

## 🔍 Core Concepts

- **Exercise**: Individual movements performed during workouts
- **Workout**: Collection of exercises performed in a session
- **MuscleGroup**: Categorization of exercises by targeted muscles

## 🚀 Getting Started

### Prerequisites

- Node.js (16.x or higher)
- PostgreSQL database
- pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gymlogger-nextjs.git
   cd gymlogger-nextjs
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a [`.env`](.env ) file based on `.env.example`

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Generate the authentication secret:
   ```bash
   npx auth secret
   ```

6. Start the development server:
   ```bash
   pnpm run dev
   ```

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

Built with the assistance of AI pair programming tools including Cursor, Copilog, and v0.
