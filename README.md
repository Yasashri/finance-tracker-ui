# ExpTrackLite - Personal Expense Tracker

A lightweight, user-friendly expense tracking application built with React and Vite. Features a cartoonish theme design that makes expense tracking fun and engaging!

## Features

- 📝 Simple expense entry with name, amount, and date
- 📊 Monthly expense statistics and summaries
- 📅 Chronological expense listing with pagination
- 🔒 Password protection for personal data
- 📱 Responsive design for mobile and desktop
- 🎨 Playful cartoonish theme with interactive elements

## Tech Stack

- React 18
- Vite
- React Router DOM
- Date-fns for date handling
- Recharts for data visualization
- SASS for styling
- Local Storage for data persistence

## Project Structure

```
src/
├── assets/          # Static assets and images
├── components/      # Reusable UI components
│   ├── ExpenseForm     # Form for adding new expenses
│   ├── ExpenseList     # Paginated list of expenses
│   ├── Header          # App header with navigation
│   ├── PasswordGate    # Security component
│   ├── StatsCards      # Statistics display
│   └── TimeRangeSelector # Date range selection
├── context/        # React context for state management
│   └── ExpenseContext  # Global expense state management
├── hooks/          # Custom React hooks
│   └── useLocalStorage # Local storage management
├── pages/          # Application pages/routes
│   ├── AddExpense     # New expense entry page
│   ├── Home           # Dashboard/overview page
│   └── MonthDetail    # Monthly expense details
├── services/       # API and external services
├── styles/         # Global styles and theme
│   ├── mixins        # SASS mixins
│   └── variables     # SASS variables
└── utils/          # Utility functions
    └── date          # Date formatting utilities
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Styling

The application uses SASS for styling with a playful, cartoonish theme:

- Thick borders and playful shadows
- Bouncy animations on interaction
- Comic Sans MS font for casual feel
- Polka dot background pattern
- Bold, fun color scheme

## Browser Support

Supports all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Version

Current version: 0.0.3

## License

Private project - All rights reserved
