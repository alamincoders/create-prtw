# create-prtw 🚀

> **Advanced React & Next.js project scaffolding tool with production-ready features**

Create modern, full-stack web applications with a single command. This CLI tool generates production-ready starter projects with best practices, testing, deployment configuration, and more.

## ✨ Features

- 🎯 **Framework Choice**: React (Vite) or Next.js with App Router/Pages Router
- 🔧 **Language Support**: JavaScript or TypeScript
- 🎨 **Styling Options**: Vanilla CSS, TailwindCSS (v3/v4), Shadcn/UI
- 🗄️ **State Management**: Redux Toolkit, Zustand, TanStack Query
- 🎭 **Icon Libraries**: Lucide, React Icons, Iconify
- ✅ **Code Quality**: ESLint, Prettier, Husky, lint-staged, Commitlint
- 🧪 **Testing**: Jest/Vitest with React Testing Library
- 🐳 **Deployment**: Dockerfile, GitHub Actions CI/CD, Docker Compose
- 🌙 **Dark Mode**: Built-in theme toggle for Tailwind/Shadcn projects
- 🔐 **Authentication**: Example auth setup with protected routes
- 📡 **API Client**: Pre-configured Axios with interceptors
- 🎣 **Custom Hooks**: Utility hooks for common use cases

## 🚀 Quick Start

```bash
npx create-prtw my-awesome-app
cd my-awesome-app
npm run dev
```

Or with a specific project name:

```bash
npx create-prtw
# Follow the interactive prompts
```

## 📋 What You'll Get

### Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   └── common/          # Shared components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # API client, utilities
│   ├── store/               # State management
│   ├── styles/              # Global styles
│   ├── routes/              # React Router setup
│   ├── pages/               # Page components
│   ├── types/               # TypeScript types
│   ├── assets/              # Images, icons, fonts
│   └── tests/               # Test files
├── .github/workflows/       # GitHub Actions
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:ui          # Open Vitest UI (Vite projects)

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Fix auto-fixable linting errors
npm run format           # Format code with Prettier
npm run format:check     # Check if code is formatted

# Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
npm run docker:dev       # Start with docker-compose
```

## 🏗️ Architecture Highlights

### State Management Examples

**Zustand Store**

```javascript
import { useAuth } from "@/store/useAuth";

const { user, login, logout, isLoading } = useAuth();
```

**Redux Toolkit**

```javascript
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "@/store/authSlice";

const { user, isAuthenticated } = useSelector((state) => state.auth);
const dispatch = useDispatch();
```

### API Client Usage

```javascript
import { api } from "@/lib/api";

// Authenticated requests
const profile = await api.getProfile();
const result = await api.post("/users", userData);

// Automatic token handling and error interceptors included
```

### Custom Hooks

```javascript
import { useLocalStorage, useDebounce, useApi } from "@/hooks";

const [theme, setTheme] = useLocalStorage("theme", "light");
const debouncedSearch = useDebounce(searchTerm, 300);
const { data, loading, error, execute } = useApi(fetchUserData);
```

## 🧪 Testing Setup

Generated projects include:

- **Component Tests**: Example tests for UI components
- **Custom Test Utils**: Wrapper with providers for testing
- **Coverage Configuration**: Pre-configured coverage reports
- **CI Integration**: Automated testing in GitHub Actions

Example test:

```javascript
import { render, screen } from "../tests/utils";
import { Button } from "../components/ui/Button";

test("renders button correctly", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
```

## 🚢 Deployment

### Docker

```bash
# Build and run locally
docker build -t my-app .
docker run -p 3000:3000 my-app

# Or use docker-compose for development
docker-compose up --build
```

### GitHub Actions

The generated CI/CD pipeline:

1. ✅ Runs tests on multiple Node.js versions
2. ✅ Performs linting and formatting checks
3. ✅ Builds the application
4. ✅ Creates Docker image on main branch
5. ✅ Pushes to Docker Hub (with secrets)

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com
REACT_APP_API_URL=https://api.example.com

# Database (if using)
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Authentication
JWT_SECRET=your-secret-key
```

## 🎨 Styling & Theming

### TailwindCSS Projects

- ✅ Dark/light mode toggle
- ✅ CSS variables for consistent theming
- ✅ Responsive design utilities
- ✅ Custom color palette

### Shadcn/UI Projects

- ✅ Beautiful, accessible components
- ✅ Customizable design system
- ✅ Built on TailwindCSS
- ✅ Type-safe component props

## 🔒 Authentication Flow

Generated projects include example authentication:

1. **Login/Logout Actions**: Pre-built auth functions
2. **Protected Routes**: Route protection with redirects
3. **Token Management**: Automatic token storage and refresh
4. **API Integration**: Auth headers in all requests
5. **State Persistence**: User session persistence

## 📱 Responsive Design

All generated components are mobile-first:

- ✅ Responsive navigation with mobile menu
- ✅ Flexible grid layouts
- ✅ Touch-friendly interactions
- ✅ Optimized for all screen sizes

## 🔧 Customization

After generation, you can:

- Add more components to `src/components/`
- Extend state management in `src/store/`
- Add API endpoints in `src/lib/api.js`
- Create custom hooks in `src/hooks/`
- Add pages/routes as needed

## 📚 Best Practices Included

- ✅ **Code Organization**: Clean folder structure
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Error Handling**: Comprehensive error boundaries
- ✅ **Performance**: Optimized builds and lazy loading
- ✅ **Accessibility**: Semantic HTML and ARIA labels
- ✅ **SEO**: Meta tags and structured data (Next.js)
- ✅ **Security**: CSRF protection and secure headers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/) - Inspiration for CLI design
- [Create Next App](https://nextjs.org/docs/api-reference/create-next-app) - Next.js scaffolding
- [Shadcn/UI](https://ui.shadcn.com/) - Beautiful component library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

## 💡 Why create-prtw?

Traditional project generators often create minimal setups that require hours of additional configuration. **create-prtw** gives you a production-ready foundation with:

- **Zero Configuration**: Everything works out of the box
- **Best Practices**: Industry-standard patterns and structures
- **Modern Stack**: Latest versions of all dependencies
- **Full Pipeline**: From development to deployment
- **Type Safety**: Complete TypeScript integration
- **Testing Ready**: Comprehensive testing setup
- **CI/CD Ready**: GitHub Actions and Docker included

Start building features immediately instead of spending time on boilerplate configuration!

---

**Happy coding!** 🎉 setup
└── Configuration files...

```

### Generated Components

- **Button Component**: Fully styled, variant-based button with TypeScript support
- **Layout Component**: Responsive header/footer with mobile menu
- **Theme Toggle**: Dark/light mode switcher (Tailwind/Shadcn projects)
- **Protected Route**: Authentication wrapper for secure pages
- **API Client**: Axios setup with request/response interceptors

### Example Files

- ✅ Working authentication store (Redux/Zustand)
- ✅ Sample test files with proper setup
- ✅ Custom hooks for common patterns
- ✅ API utilities and error handling
- ✅ TypeScript types and interfaces
- ✅ Production-ready configurations

## 🛠️ Available Options

### Frameworks
- **React (Vite)**: Lightning-fast development with HMR
- **Next.js**: Full-stack React framework with SSR/SSG

### Styling Solutions
- **Vanilla CSS**: Custom CSS with CSS variables
- **TailwindCSS**: Utility-first CSS framework (v3 Stable/v4 Experimental)
- **Shadcn/UI**: Beautiful components built on Tailwind

### State Management
- **Redux Toolkit**: Predictable state container with modern Redux
- **Zustand**: Lightweight state management with persistence
- **TanStack Query**: Powerful data synchronization for React

### Testing & Quality
- **Testing**: Jest (Next.js) or Vitest (React) with React Testing Library
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier with auto-formatting
- **Git Hooks**: Husky with lint-staged and Commitlint
- **Type Safety**: Full TypeScript support with strict configuration

### Deployment Ready
- **Docker**: Multi-stage Dockerfile for production builds
- **GitHub Actions**: Complete CI/CD pipeline
- **Docker Compose**: Development environment setup
- **Environment**: Production-ready environment variable handling
```
