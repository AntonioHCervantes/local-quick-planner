# Local Quick Planner - Agent Guidelines

This is a Next.js task management application that allows users to organize and manage their tasks in different views:
- My Day: For daily tasks
- Kanban Board: For project management with columns (To Do, In Progress, Done)

## Project Structure
- `/app`: Next.js app router pages and layouts
- `/components`: React components including the Board and task management UI
- `/lib`: Utilities, types, and state management using Zustand

## Task Structure
Tasks in this application have the following properties:
- `id`: string
- `title`: string
- `description`: string (optional)
- `status`: 'todo' | 'in-progress' | 'done'
- `createdAt`: Date
- `updatedAt`: Date

## Creating Tasks
When creating new tasks:
1. Follow the existing task structure
2. Use clear and concise titles
3. Add meaningful descriptions
4. Place new tasks in the appropriate status column
5. Ensure the task follows TypeScript types defined in `/lib/types.ts`

## Project Goals
- Keep the UI clean and minimal
- Ensure type safety with TypeScript
- Follow React best practices
- Maintain good performance with proper state management
