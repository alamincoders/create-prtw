# create-prtw 🚀

> **Advanced React & Next.js project scaffolding tool with production-ready features**

Create modern, full-stack web applications with a single command. This CLI tool generates production-ready starter projects with best practices, testing, and more.

## ✨ Features

- 🎯 **Framework Choice**: React (Vite) or Next.js with App Router/Pages Router
- 🔧 **Language Support**: JavaScript or TypeScript
- 📦 **Package Manager**: Choose between npm, yarn, or bun
- 🎨 **Styling Options**: Vanilla CSS, TailwindCSS (v3/v4), Shadcn/UI
- 🗄️ **State Management**: Redux Toolkit, Zustand, TanStack Query
- 🎭 **Icon Libraries**: Lucide, React Icons, Iconify
- ✅ **Code Quality**: ESLint, Prettier, Husky, lint-staged, Commitlint
- 🧪 **Testing**: Jest/Vitest with React Testing Library
- 🌙 **Dark Mode**: Built-in theme toggle for Tailwind/Shadcn projects
- 🔐 **Authentication**: Example auth setup with protected routes
- 📡 **API Client**: Pre-configured Axios with interceptors
- 🎣 **Custom Hooks**: Utility hooks for common use cases

## 🚀 Quick Start

\`\`\`bash
npx create-prtw my-awesome-app
cd my-awesome-app
npm run dev
\`\`\`

Or with a specific project name:

\`\`\`bash
npx create-prtw

# Follow the interactive prompts

\`\`\`

## 📋 What You'll Get

### Project Structure

\`\`\`
my-app/
├── src/
│ ├── components/
│ │ ├── ui/ # Reusable UI components
│ │ ├── layout/ # Layout components
│ │ └── common/ # Shared components
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # API client, utilities
│ ├── store/ # State management
│ ├── styles/ # Global styles
│ ├── routes/ # React Router setup
│ ├── pages/ # Page components
│ ├── types/ # TypeScript types
│ ├── assets/ # Images, icons, fonts
│ └── tests/ # Test files
└── Configuration files...
\`\`\`

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

### Package Managers

- **npm**: Node Package Manager (default)
- **yarn**: Fast, reliable, and secure dependency management
- **bun**: All-in-one JavaScript runtime & toolkit

### Styling Solutions

- **Vanilla CSS**: Custom CSS with CSS variables
- **TailwindCSS**: Utility-first CSS framework (v3 Stable/v4 Experimental)
- **Shadcn/UI**: Beautiful components built on Tailwind

### State Management

- **Redux Toolkit**: Predictable state container with modern Redux
- **Zustand**: Lightweight state management with persistence
- **TanStack Query**: Powerful data synchronization for React

### Code Quality Tools

- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier with auto-formatting
- **Git Hooks**: Husky with lint-staged and Commitlint
- **Type Safety**: Full TypeScript support with strict configuration

## 🎯 Commands

\`\`\`bash

# Development

npm run dev # Start development server
yarn dev # Start development server (yarn)
bun dev # Start development server (bun)

npm run build # Build for production
npm run preview # Preview production build

# Testing

npm run test # Run tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:ui # Open Vitest UI (Vite projects)

# Code Quality

npm run lint # Check for linting errors
npm run lint:fix # Fix auto-fixable linting errors
npm run format # Format code with Prettier
npm run format:check # Check if code is formatted
\`\`\`

## 🏗️ Architecture Highlights

### State Management Examples

**Zustand Store**

\`\`\`javascript
import { useAuth } from "@/store/useAuth";

const { user, login, logout, isLoading } = useAuth();
\`\`\`

**Redux Toolkit**

\`\`\`javascript
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "@/store/authSlice";

const { user, isAuthenticated } = useSelector((state) => state.auth);
const dispatch = useDispatch();
\`\`\`

### API Client Usage

\`\`\`javascript
import { api } from "@/lib/api";

// Authenticated requests
const profile = await api.getProfile();
const result = await api.post("/users", userData);

// Automatic token handling and error interceptors included
\`\`\`

### Custom Hooks

\`\`\`javascript
import { useLocalStorage, useDebounce, useApi } from "@/hooks";

const [theme, setTheme] = useLocalStorage("theme", "light");
const debouncedSearch = useDebounce(searchTerm, 300);
const { data, loading, error, execute } = useApi(fetchUserData);
\`\`\`

## 🧪 Testing Setup

Generated projects include:

- **Component Tests**: Example tests for UI components
- **Custom Test Utils**: Wrapper with providers for testing
- **Coverage Configuration**: Pre-configured coverage reports

Example test:

\`\`\`javascript
import { render, screen } from "../tests/utils";
import { Button } from "../components/ui/Button";

test("renders button correctly", () => {
render(<Button>Click me</Button>);
expect(screen.getByText("Click me")).toBeInTheDocument();
});
\`\`\`

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
- **Package Manager Choice**: Use npm, yarn, or bun
- **Type Safety**: Complete TypeScript integration
- **Simplified Setup**: Focus on core development without testing complexity

Start building features immediately instead of spending time on boilerplate configuration!

---

**Happy coding!** 🎉
