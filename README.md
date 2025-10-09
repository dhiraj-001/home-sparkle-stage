# Home Sparkle - Service Booking Platform

A modern, responsive web application for booking home services built with React, TypeScript, and Tailwind CSS. The platform allows users to browse services, manage bookings, handle cart operations, and access various home maintenance services.

## 🚀 Features

### Core Functionality
- **Service Browsing**: Explore categories and services with detailed information
- **User Authentication**: Secure login, registration, and password recovery
- **Booking Management**: Create, view, and manage service bookings
- **Cart System**: Add services to cart, manage quantities, and apply coupons
- **Favorites**: Save preferred services for quick access
- **Profile Management**: Update user information and preferences
- **Checkout Process**: Seamless booking completion with payment integration

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live cart updates and booking status tracking
- **Search & Filters**: Advanced filtering and search capabilities
- **Interactive UI**: Modern components with smooth animations
- **Error Handling**: Comprehensive error states and user feedback

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components built on Radix UI
- **Lucide React** - Beautiful icon library

### State Management & Data
- **React Hooks** - Built-in state management
- **Local Storage** - Client-side data persistence
- **RESTful APIs** - Backend communication

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Bun** - Fast JavaScript runtime (alternative to npm)

## 📁 Project Structure

```
home-sparkle-stage/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media files
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...           # Custom components
│   ├── helpers/          # API helper functions
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   │   ├── AuthPages/    # Authentication pages
│   │   ├── Category/     # Category-related pages
│   │   ├── Services/     # Service-related pages
│   │   └── ...           # Other pages
│   └── types/            # TypeScript type definitions
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm**, **yarn**, or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd home-sparkle-stage
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using bun (recommended)
   bun install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://admin.sarvoclub.com
   # Add other environment variables as needed
   ```

4. **Start the development server**
   ```bash
   # Using npm
   npm run dev

   # Using yarn
   yarn dev

   # Using bun
   bun run dev
   ```

5. **Build for production**
   ```bash
   # Using npm
   npm run build

   # Using yarn
   yarn build

   # Using bun
   bun run build
   ```

## 📱 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `lint` - Run ESLint

## 🔧 Configuration

### API Configuration
The application connects to the backend API at `https://admin.sarvoclub.com`. To use a different API endpoint, update the `VITE_API_URL` environment variable.

### Styling
- **Tailwind CSS** is configured in `tailwind.config.ts`
- **Custom styles** can be added in `src/index.css`
- **Component styles** use Tailwind utility classes

## 🏗️ Architecture

### Component Structure
- **Pages**: Top-level route components
- **Components**: Reusable UI elements
- **Helpers**: API interaction functions
- **Hooks**: Custom React hooks for shared logic

### API Integration
- Centralized API calls in helper files
- Consistent error handling and loading states
- TypeScript interfaces for API responses

### State Management
- Local component state with React hooks
- Local storage for user session data
- Context providers for global state (if needed)

## 🔐 Authentication

The application supports:
- User registration and login
- OTP verification
- Password reset functionality
- JWT token-based authentication

## 📊 Key Features Implementation

### Booking System
- Create bookings with service details
- Real-time booking status updates
- Cancellation and rescheduling

### Cart Management
- Add/remove services
- Quantity management
- Coupon code application
- Price calculations

### Service Discovery
- Category-based browsing
- Service search and filtering
- Detailed service information
- Favorite services

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login flow
- [ ] Service browsing and search
- [ ] Cart operations (add, update, remove)
- [ ] Booking creation and management
- [ ] Profile updates
- [ ] Responsive design on mobile/tablet
- [ ] Error handling and edge cases

## 🚀 Deployment

### Build Process
1. Run `npm run build` to create production build
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables on the server

### Recommended Hosting
- **Vercel** - Optimized for Vite applications
- **Netlify** - Great for static sites with forms
- **AWS S3 + CloudFront** - Scalable static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint configuration
- Maintain consistent naming conventions
- Add proper TypeScript types

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

Keep the dependencies updated and follow semantic versioning for releases.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
