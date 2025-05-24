# Famasi Frontend

A modern, responsive pharmacy management system frontend built with React, TypeScript, and Vite.

## 🚀 Features

- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Real-time Updates**: Efficient data fetching and caching
- **Authentication**: Secure user authentication and authorization
- **Medicine Management**: Complete CRUD operations for medicines
- **Sales Management**: Track and manage medicine sales
- **Stock Management**: Monitor and update inventory levels
- **Usage Information**: AI-powered medicine usage information

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: 
  - Radix UI primitives
  - shadcn/ui components
  - Lucide React icons
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Notifications**: Sonner

## 📁 Project Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries and configurations
├── pages/         # Page components and routes
├── services/      # API services and configurations
├── type/          # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Root component
└── main.tsx       # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd famasi_frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add necessary environment variables:
```env
VITE_API_URL=your_api_url
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Building for Production

```bash
npm run build
# or
yarn build
```

## 🎨 UI Components

The application uses shadcn/ui components, which are built on top of Radix UI primitives. Key components include:

- Dialog/Modal components for forms and confirmations
- Data tables for displaying medicine and sales information
- Form components with validation
- Navigation and layout components
- Toast notifications for user feedback

## 🔄 State Management

- **React Query**: Used for server state management, caching, and real-time updates
- **React Context**: Used for global state management (auth, theme, etc.)
- **Local State**: React's useState for component-level state

## 📱 Responsive Design

The application is built with a mobile-first approach using Tailwind CSS:

- Responsive grid layouts
- Flexible components that adapt to screen size
- Touch-friendly interfaces
- Optimized for both desktop and mobile devices

## 🔒 Authentication

- JWT-based authentication
- Protected routes
- Role-based access control
- Secure token storage

## 📊 Data Visualization

- Sales analytics and reports
- Stock level monitoring
- Usage statistics
- Interactive charts and graphs

## 🧪 Testing

```bash
# Run tests
npm test
# or
yarn test
```

## 🐳 Docker Support

The application includes a Dockerfile for containerization:

```bash
# Build the Docker image
docker build -t famasi-frontend .

# Run the container
docker run -p 3000:3000 famasi-frontend
```

## 📝 License

[Your License]

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email [your-email] or open an issue in the repository.
