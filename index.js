#!/usr/bin/env node
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.cyan("🚀 Welcome to create-prtw!"));
console.log(chalk.gray("Advanced React & Next.js project scaffolding tool\n"));

// Get project name from command line args or prompt
let projectName = process.argv[2];
if (!projectName) {
  const nameAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      default: "my-app",
      validate: (input) => {
        if (!input.trim()) return "Project name cannot be empty";
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) return "Project name can only contain letters, numbers, hyphens, and underscores";
        return true;
      },
    },
  ]);
  projectName = nameAnswer.projectName;
}

// Main prompts
const answers = await inquirer.prompt([
  {
    type: "list",
    name: "framework",
    message: "Choose framework:",
    choices: ["React (Vite)", "Next.js"],
  },
  {
    type: "list",
    name: "router",
    message: "Choose router system:",
    choices: ["App Router (Recommended)", "Pages Router (Legacy)"],
    when: (answers) => answers.framework === "Next.js",
  },
  {
    type: "list",
    name: "language",
    message: "Choose language:",
    choices: ["JavaScript", "TypeScript"],
  },
  {
    type: "list",
    name: "styling",
    message: "Choose styling solution:",
    choices: ["Tailwind", "Shadcn", "None"],
  },
  {
    type: "list",
    name: "tailwindVersion",
    message: "Choose Tailwind version:",
    choices: ["v3 (Stable)", "v4 (Experimental)"],
    when: (answers) => answers.styling === "Tailwind",
  },
  {
    type: "list",
    name: "stateManagement",
    message: "Choose state management:",
    choices: ["Redux", "Zustand", "Skip"],
  },
  {
    type: "list",
    name: "icons",
    message: "Choose icon library:",
    choices: ["Lucide", "React Icons", "Iconify", "Skip"],
  },
  {
    type: "list",
    name: "linting",
    message: "Add ESLint & Prettier?",
    choices: ["Yes", "No"],
  },
]);

console.log(chalk.green(`\n✅ Configuration complete!`));
console.log(chalk.blue(`📦 Creating ${answers.framework} project with ${answers.language}...`));

const isTypeScript = answers.language === "TypeScript";
const isNextJs = answers.framework === "Next.js";
const isAppRouter = answers.router === "App Router (Recommended)";
const fileExt = isTypeScript ? "tsx" : "jsx";
const configExt = isTypeScript ? "ts" : "js";

// Create project
let spinner = ora("Creating base project...").start();

try {
  if (isNextJs) {
    const nextArgs = [
      "create-next-app@latest",
      projectName,
      "--use-npm",
      isTypeScript ? "--typescript" : "--javascript",
      isAppRouter ? "--app" : "--src-dir",
      "--tailwind", // We'll remove this later if not needed
      "--eslint",
      "--import-alias",
      "@/*",
    ];

    if (!isAppRouter) {
      nextArgs.push("--src-dir");
    }

    await execa("npx", nextArgs, { stdio: "pipe" });
  } else {
    // Create Vite React project
    await execa("npm", ["create", "vite@latest", projectName, "--", "--template", isTypeScript ? "react-ts" : "react"], { stdio: "pipe" });
  }

  spinner.succeed("Base project created!");

  // Change to project directory
  process.chdir(projectName);

  // Install base dependencies
  spinner = ora("Installing dependencies...").start();
  await execa("npm", ["install"], { stdio: "pipe" });
  spinner.succeed("Dependencies installed!");

  // Setup styling
  if (answers.styling === "Tailwind") {
    spinner = ora("Setting up Tailwind CSS...").start();

    if (!isNextJs) {
      // Install Tailwind for React/Vite
      const tailwindVersion = answers.tailwindVersion === "v4 (Experimental)" ? "@next" : "@latest";
      await execa("npm", ["install", "-D", `tailwindcss${tailwindVersion}`, "autoprefixer", "postcss"], { stdio: "pipe" });
      await execa("npx", ["tailwindcss", "init", "-p"], { stdio: "pipe" });
    }

    // Create tailwind config
    const tailwindConfig = isNextJs ? generateNextTailwindConfig() : generateViteTailwindConfig();
    await fs.writeFile(`tailwind.config.${configExt}`, tailwindConfig);

    // Create CSS file
    const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    if (isNextJs) {
      await fs.writeFile("src/app/globals.css", cssContent);
    } else {
      await fs.writeFile("src/index.css", cssContent);
    }

    spinner.succeed("Tailwind CSS configured!");
  } else if (answers.styling === "Shadcn") {
    spinner = ora("Setting up Shadcn/UI...").start();

    // Install Tailwind first (required for Shadcn)
    if (!isNextJs) {
      await execa("npm", ["install", "-D", "tailwindcss@latest", "autoprefixer", "postcss"], { stdio: "pipe" });
      await execa("npx", ["tailwindcss", "init", "-p"], { stdio: "pipe" });
    }

    // Install Shadcn dependencies
    await execa("npm", ["install", "class-variance-authority", "clsx", "tailwind-merge"], { stdio: "pipe" });
    await execa("npm", ["install", "-D", "@types/node"], { stdio: "pipe" });

    // Create shadcn config
    const shadcnConfig = generateShadcnConfig();
    await fs.writeFile("components.json", shadcnConfig);

    spinner.succeed("Shadcn/UI configured!");
  }

  // Setup state management
  if (answers.stateManagement === "Redux") {
    spinner = ora("Setting up Redux Toolkit...").start();
    await execa("npm", ["install", "@reduxjs/toolkit", "react-redux"], { stdio: "pipe" });
    spinner.succeed("Redux Toolkit installed!");
  } else if (answers.stateManagement === "Zustand") {
    spinner = ora("Setting up Zustand...").start();
    await execa("npm", ["install", "zustand"], { stdio: "pipe" });
    spinner.succeed("Zustand installed!");
  }

  // Setup icons
  if (answers.icons === "Lucide") {
    spinner = ora("Installing Lucide React...").start();
    await execa("npm", ["install", "lucide-react"], { stdio: "pipe" });
    spinner.succeed("Lucide React installed!");
  } else if (answers.icons === "React Icons") {
    spinner = ora("Installing React Icons...").start();
    await execa("npm", ["install", "react-icons"], { stdio: "pipe" });
    spinner.succeed("React Icons installed!");
  } else if (answers.icons === "Iconify") {
    spinner = ora("Installing Iconify...").start();
    await execa("npm", ["install", "@iconify/react"], { stdio: "pipe" });
    spinner.succeed("Iconify installed!");
  }

  // Setup React Router for React projects
  if (!isNextJs) {
    spinner = ora("Setting up React Router...").start();
    await execa("npm", ["install", "react-router-dom"], { stdio: "pipe" });
    spinner.succeed("React Router installed!");
  }

  // Setup ESLint & Prettier
  if (answers.linting === "Yes") {
    spinner = ora("Setting up ESLint & Prettier...").start();

    if (!isNextJs) {
      await execa("npm", ["install", "-D", "eslint", "prettier", "eslint-config-prettier", "eslint-plugin-prettier"], { stdio: "pipe" });
    } else {
      await execa("npm", ["install", "-D", "prettier", "eslint-config-prettier", "eslint-plugin-prettier"], { stdio: "pipe" });
    }

    spinner.succeed("ESLint & Prettier configured!");
  }

  // Create folder structure
  spinner = ora("Creating folder structure...").start();
  await createFolderStructure(answers, isTypeScript, isNextJs, isAppRouter);
  spinner.succeed("Folder structure created!");

  // Generate starter files
  spinner = ora("Generating starter files...").start();
  await generateStarterFiles(answers, isTypeScript, isNextJs, isAppRouter, fileExt);
  spinner.succeed("Starter files generated!");

  // Final success message
  console.log(chalk.green("\n🎉 Project created successfully!"));
  console.log(chalk.blue("\n📋 Next steps:"));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white("  npm run dev"));
  console.log(chalk.gray("\nHappy coding! 🚀"));
} catch (error) {
  spinner.fail("Error creating project");
  console.error(chalk.red(error.message));
  process.exit(1);
}

// Helper functions
function generateNextTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
}

function generateViteTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
}

function generateShadcnConfig() {
  return JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "default",
      rsc: true,
      tsx: true,
      tailwind: {
        config: "tailwind.config.js",
        css: "src/app/globals.css",
        baseColor: "slate",
        cssVariables: true,
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
      },
    },
    null,
    2
  );
}

async function createFolderStructure(answers, isTypeScript, isNextJs, isAppRouter) {
  const folders = ["src/components/ui", "src/components/common", "src/hooks", "src/layouts", "src/utils"];

  if (isNextJs) {
    if (isAppRouter) {
      folders.push("src/app");
    } else {
      folders.push("src/pages");
    }
  } else {
    folders.push("src/routes");
  }

  if (answers.stateManagement !== "Skip") {
    folders.push("src/store");
  }

  for (const folder of folders) {
    await fs.ensureDir(folder);
  }
}

async function generateStarterFiles(answers, isTypeScript, isNextJs, isAppRouter, fileExt) {
  // Generate Button component
  const buttonComponent = generateButtonComponent(answers.styling, isTypeScript);
  await fs.writeFile(`src/components/ui/Button.${fileExt}`, buttonComponent);

  // Generate state management files
  if (answers.stateManagement === "Zustand") {
    const zustandStore = generateZustandStore(isTypeScript);
    await fs.writeFile(`src/store/useAuth.${isTypeScript ? "ts" : "js"}`, zustandStore);
  } else if (answers.stateManagement === "Redux") {
    const reduxSlice = generateReduxSlice(isTypeScript);
    await fs.writeFile(`src/store/authSlice.${isTypeScript ? "ts" : "js"}`, reduxSlice);

    const reduxStore = generateReduxStore(isTypeScript);
    await fs.writeFile(`src/store/store.${isTypeScript ? "ts" : "js"}`, reduxStore);
  }

  // Generate React Router setup for React projects
  if (!isNextJs) {
    const appRoutes = generateReactRoutes(isTypeScript, fileExt);
    await fs.writeFile(`src/routes/AppRoutes.${fileExt}`, appRoutes);

    const mainApp = generateReactApp(answers, isTypeScript, fileExt);
    await fs.writeFile(`src/App.${fileExt}`, mainApp);
  }

  // Generate ESLint & Prettier configs
  if (answers.linting === "Yes") {
    const eslintConfig = generateEslintConfig(isNextJs);
    await fs.writeFile(".eslintrc.json", eslintConfig);

    const prettierConfig = generatePrettierConfig();
    await fs.writeFile(".prettierrc", prettierConfig);
  }

  // Generate utils
  const utilsFile = generateUtils(isTypeScript);
  await fs.writeFile(`src/utils/index.${isTypeScript ? "ts" : "js"}`, utilsFile);
}

function generateButtonComponent(styling, isTypeScript) {
  const typeImports = isTypeScript
    ? `
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}`
    : "";

  const propTypes = isTypeScript ? ": ButtonProps" : "";

  if (styling === "Tailwind" || styling === "Shadcn") {
    return `import React from 'react';${typeImports}

export const Button${propTypes} = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg'
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variants[variant]} \${sizes[size]} \${className}\`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};`;
  } else {
    return `import React from 'react';${typeImports}

export const Button${propTypes} = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const styles = {
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none'
    },
    secondary: {
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none'
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#3b82f6',
      border: '1px solid #3b82f6'
    }
  };
  
  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '10px 20px', fontSize: '16px' },
    lg: { padding: '12px 24px', fontSize: '18px' }
  };
  
  return (
    <button
      style={{
        ...styles[variant],
        ...sizeStyles[size],
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...className
      }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};`;
  }
}

function generateZustandStore(isTypeScript) {
  if (isTypeScript) {
    return `import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = { id: '1', name: 'John Doe', email };
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  }
}));`;
  } else {
    return `import { create } from 'zustand';

export const useAuth = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = { id: '1', name: 'John Doe', email };
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  setUser: (user) => {
    set({ user, isAuthenticated: true });
  }
}));`;
  }
}

function generateReduxSlice(isTypeScript) {
  if (isTypeScript) {
    return `import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: '1', name: 'John Doe', email };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });
  }
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;`;
  } else {
    return `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: '1', name: 'John Doe', email };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });
  }
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;`;
  }
}

function generateReduxStore(isTypeScript) {
  if (isTypeScript) {
    return `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`;
  } else {
    return `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});`;
  }
}

function generateReactRoutes(isTypeScript, fileExt) {
  return `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';

export const AppRoutes${isTypeScript ? ": React.FC" : ""} = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;`;
}

function generateReactApp(answers, isTypeScript, fileExt) {
  let imports = `import React from 'react';
import AppRoutes from './routes/AppRoutes';`;

  if (answers.styling === "Tailwind" || answers.styling === "Shadcn") {
    imports += `\nimport './index.css';`;
  }

  if (answers.stateManagement === "Redux") {
    imports += `\nimport { Provider } from 'react-redux';
import { store } from './store/store';`;
  }

  let appContent = `function App() {
  return (`;

  if (answers.stateManagement === "Redux") {
    appContent += `
    <Provider store={store}>`;
  }

  appContent += `
      <div className="App">
        <AppRoutes />
      </div>`;

  if (answers.stateManagement === "Redux") {
    appContent += `
    </Provider>`;
  }

  appContent += `
  );
}

export default App;`;

  return imports + "\n\n" + appContent;
}

function generateEslintConfig(isNextJs) {
  if (isNextJs) {
    return JSON.stringify(
      {
        extends: ["next/core-web-vitals", "prettier"],
        plugins: ["prettier"],
        rules: {
          "prettier/prettier": "error",
        },
      },
      null,
      2
    );
  } else {
    return JSON.stringify(
      {
        env: {
          browser: true,
          es2021: true,
        },
        extends: ["eslint:recommended", "@vitejs/eslint-config-react", "prettier"],
        plugins: ["prettier"],
        rules: {
          "prettier/prettier": "error",
        },
      },
      null,
      2
    );
  }
}

function generatePrettierConfig() {
  return JSON.stringify(
    {
      semi: true,
      trailingComma: "es5",
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
    },
    null,
    2
  );
}

function generateUtils(isTypeScript) {
  if (isTypeScript) {
    return `export const cn = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};`;
  } else {
    return `export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};`;
  }
}
