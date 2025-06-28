# Smart Meal Planner

A personalized meal planning application that creates customized meal recommendations based on your dietary preferences, cooking skills, and health goals.

## Features

- **Dynamic Questionnaire**: Multi-step questionnaire that adapts to your responses
- **Personalized Recommendations**: Meal suggestions based on your cooking skill, time constraints, and dietary preferences
- **Allergy Management**: Support for common food allergies and dietary restrictions
- **Beautiful UI**: Modern, responsive design with smooth transitions
- **Real-time Results**: Instant meal plan generation based on your preferences

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd meal-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Create and migrate the database
   npx prisma db push
   
   # (Optional) Seed with sample data
   npm run seed
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Start the Questionnaire**: Answer questions about your dietary goals, cooking experience, and preferences

2. **Review Your Profile**: See a summary of your responses and personalized recommendations

3. **Get Meal Suggestions**: View meal recommendations tailored to your skill level and time constraints

4. **Next Steps**: Generate full meal plans and shopping lists (coming soon)

## Project Structure

```
meal-planner/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main application page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── questionnaire/     # Questionnaire components
│   │   └── MealPlanResults.tsx # Results display
│   ├── lib/                   # Utility libraries
│   │   ├── types/            # TypeScript type definitions
│   │   └── ai/               # AI integration (future)
│   └── generated/            # Generated Prisma client
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
└── docs/                     # Documentation
```

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components with Tailwind

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
# Add other environment variables as needed
```

## Future Enhancements

- [ ] AI-powered meal recommendations
- [ ] Shopping list generation
- [ ] Recipe database integration
- [ ] Nutritional analysis
- [ ] Meal planning calendar
- [ ] User accounts and saved preferences
- [ ] Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

If you encounter any issues or have questions, please check the documentation or create an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
