---
description: Meal Planning Service Development Rules
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
alwaysApply: true
---

## Project Architecture Principles
- Build modular, niche-agnostic components that can serve multiple dietary needs
- Use conditional logic for questionnaire branching based on user goals
- Implement comprehensive recipe tagging system for multi-niche filtering
- Prioritize TypeScript strict mode and comprehensive error handling
- Follow Next.js 13+ App Router patterns with server/client components
- Use Prisma for type-safe database operations
- Implement responsive design with Tailwind CSS
- Add proper loading states and error boundaries

## Code Style Guidelines
- Use descriptive variable names that reflect dietary/medical context
- Add JSDoc comments for complex dietary logic
- Implement proper error handling for medical condition validations
- Use TypeScript interfaces for all data structures
- Follow consistent naming conventions for dietary tags and conditions

## Database Design Principles
- Design flexible schemas that accommodate multiple dietary taxonomies
- Use normalized tables with junction tables for many-to-many relationships
- Include audit fields (created_at, updated_at) for all entities
- Implement soft deletes for user data
- Add proper indexing for recipe filtering queries 