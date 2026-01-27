# Custom instructions for Copilot

## Project context
This is a web application built with Next.js 15, using Tailwind CSS (version 4) and Auth.js (version 5 beta). Prisma is used as the ORM for accessing the PostgreSQL database.
The application's theme is workout tracking. The main concepts in the application are: Exercise, Workout, and MuscleGroup.

## Technology Stack
- **Framework**: Next.js 15 (with App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4
- **Authentication**: Auth.js 5 (beta) with Prisma adapter
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI, shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Icons**: Heroicons, Lucide React, React Icons
- **Package Manager**: pnpm (preferred)

## Build/Run/Test Commands

### Development
```bash
pnpm run dev          # Start development server with Turbopack
pnpm run dev:https    # Start development server with HTTPS
```

### Build & Production
```bash
pnpm run build        # Build for production (includes Prisma generate)
pnpm run start        # Start production server
```

### Code Quality
```bash
pnpm run lint         # Lint and auto-fix with Biome
pnpm run format       # Format code with Biome
```

### Database
```bash
npx prisma migrate dev    # Run database migrations
npx prisma generate       # Generate Prisma client
npx prisma db seed        # Seed the database
```

### Email Development
```bash
pnpm run email        # Start email development server on port 3100
```

## Project Structure

```
/app                  # Next.js App Router pages and layouts
/src
  /actions           # Server actions
  /api               # API utilities
  /components        # Reusable components
  /data              # Data fetching and caching
  /hooks             # Custom React hooks
  /lib               # Utility libraries and configurations
  /models            # Data models and types
  /routes.ts         # Route definitions
  /schemas           # Zod schemas for validation
  /types             # TypeScript type definitions
  /utils             # Utility functions
  /views             # Page-level view components
/prisma              # Database schema and migrations
  /schema.prisma     # Database schema
  /seed.ts           # Database seed data
/emails              # React Email templates
```

## Coding Style

### General
- **Indentation**: Use tabs, not spaces
- **Variable naming**: Use camelCase for variables and functions
- **Functions**: Prefer arrow functions over traditional function expressions
- **TypeScript**: Strict mode is enabled - always provide proper types
- **Imports**: Use path alias `@/*` for absolute imports from root

### Formatting
- **Quotes**: Single quotes for JavaScript, double quotes for JSX
- **Indent width**: 4 spaces (configured in Biome)
- **Line endings**: LF (Unix-style)

### Component Guidelines
- Use functional components with TypeScript
- Keep components focused and single-purpose
- Place UI components in `/src/components`
- Use shadcn/ui components from `/src/components/ui` when available
- Server components by default, use 'use client' only when needed

### State Management
- Use React Hook Form for form state
- Use Zod for schema validation
- Server actions for data mutations
- Keep client-side state minimal

## Database & Prisma

### Key Models
- **User**: User accounts and authentication
- **Exercise**: Individual exercise definitions
- **Workout**: Workout sessions
- **MuscleGroup**: Exercise categorization by muscle groups

### Migrations
- Always create migrations for schema changes
- Run `npx prisma migrate dev` after schema changes
- Update seed data if needed for new models

## Authentication
- Uses Auth.js v5 (beta) with Prisma adapter
- Email-based authentication with magic links
- Session management handled by Auth.js
- Protected routes use middleware

## Contribution Guidelines

### Before Making Changes
1. Ensure you understand the existing code structure
2. Check for similar existing components or utilities
3. Follow the established patterns in the codebase

### When Writing Code
1. **Always run linter**: `pnpm run lint` before committing
2. **Type safety**: Ensure all TypeScript types are correct
3. **Component reuse**: Check if similar components exist before creating new ones
4. **Validation**: Use Zod schemas for all form and API validation
5. **Server actions**: Use server actions for data mutations, not API routes
6. **Database queries**: Use Prisma client, leverage relations properly

### File Organization
- Components: `/src/components` (shared) or co-located with views
- Server actions: `/src/actions`
- Schemas: `/src/schemas` (Zod validation schemas)
- Types: `/src/types` or co-located with components
- Utilities: `/src/utils`

### Testing
- Currently no test infrastructure exists
- Manual testing required for all changes
- Test all user-facing features in the browser

### Documentation
- Update README.md for major features
- Add JSDoc comments for complex functions
- Keep this copilot-instructions.md up to date

## Common Tasks

### Adding a New Feature
1. Create necessary schema changes in `/prisma/schema.prisma`
2. Run migrations: `npx prisma migrate dev`
3. Create Zod schemas in `/src/schemas`
4. Create server actions in `/src/actions`
5. Build UI components in `/src/components`
6. Create views in `/src/views`
7. Add routes in `/app`
8. Test thoroughly in development
9. Run linter: `pnpm run lint`

### Working with Forms
1. Create Zod schema in `/src/schemas`
2. Use React Hook Form with zodResolver
3. Create server action for form submission
4. Handle validation errors appropriately
5. Show success/error feedback with toast (using sonner)

### Database Changes
1. Modify `/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Update seed data if necessary
4. Regenerate Prisma client (done automatically)

## Security Considerations
- Never commit secrets or API keys to the repository
- Use environment variables for sensitive configuration
- Validate all user inputs with Zod schemas
- Sanitize database queries (Prisma handles this)
- Use server actions for sensitive operations
- Keep dependencies up to date for security patches

## Environment Variables
Required environment variables (see `.env.example`):
- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: Auth.js secret (generate with `npx auth secret`)
- `AUTH_URL`: Application URL for authentication callbacks
- Email provider configuration (if using email auth)

## Ignored Files
The following are auto-generated and should not be edited:
- `/src/components/ui/*` - shadcn/ui components
- `/.next` - Next.js build output
- `/node_modules` - Dependencies
- Prisma client files

## Notes for AI Assistants
- This project uses Biome for linting and formatting, not ESLint/Prettier
- Tailwind CSS v4 has some differences from v3 (e.g., @import syntax)
- Auth.js v5 is in beta and has breaking changes from v4
- Always check the package.json for exact dependency versions
- The project uses tabs (not spaces) for indentation - this is enforced
- UI components follow shadcn/ui patterns and should not be modified directly