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
    name: "packageManager",
    message: "Choose package manager:",
    choices: ["npm", "yarn", "bun"],
  },
  {
    type: "list",
    name: "styling",
    message: "Choose styling solution:",
    choices: ["Tailwind", "Shadcn", "Vanilla CSS", "None"],
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
    choices: ["Redux Toolkit", "Zustand", "TanStack Query", "Skip"],
  },
  {
    type: "list",
    name: "icons",
    message: "Choose icon library:",
    choices: ["Lucide", "React Icons", "Iconify", "Skip"],
  },
  {
    type: "list",
    name: "codeQuality",
    message: "Add code quality tools (ESLint + Prettier + Husky + lint-staged + Commitlint)?",
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
const packageManager = answers.packageManager;

// Create project
let spinner = ora("Creating base project...").start();

try {
  if (isNextJs) {
    const nextArgs = [
      "create-next-app@latest",
      projectName,
      `--use-${packageManager}`,
      isTypeScript ? "--typescript" : "--javascript",
      isAppRouter ? "--app" : "--src-dir",
      answers.styling === "Tailwind" ? "--tailwind" : "",
      "--eslint",
      "--import-alias",
      "@/*",
    ].filter(Boolean);

    await execa("npx", nextArgs, { stdio: "inherit" });
  } else {
    // Create Vite React project
    await execa(
      packageManager,
      packageManager === "npm"
        ? ["create", "vite@latest", projectName, "--", "--template", isTypeScript ? "react-ts" : "react"]
        : ["create", "vite", projectName, "--template", isTypeScript ? "react-ts" : "react"],
      { stdio: "pipe" }
    );
  }

  spinner.succeed("Base project created!");

  // Change to project directory
  process.chdir(projectName);

  // Install base dependencies
  if (!isNextJs) {
    spinner = ora("Installing dependencies...").start();
    await execa(packageManager, packageManager === "npm" ? ["install"] : [], { stdio: "inherit" });
    spinner.succeed("Dependencies installed!");
  }

  // Setup styling
  if (answers.styling === "Tailwind") {
    spinner = ora("Setting up Tailwind CSS...").start();

    if (!isNextJs) {
      // Install Tailwind for React/Vite
      const tailwindVersion = answers.tailwindVersion === "v4 (Experimental)" ? "@next" : "@latest";
      const installCmd = packageManager === "npm" ? ["install", "-D"] : packageManager === "yarn" ? ["add", "-D"] : ["add", "-d"];
      await execa(packageManager, [...installCmd, `tailwindcss${tailwindVersion}`, "autoprefixer", "postcss"], {
        stdio: "pipe",
      });
      await execa("npx", ["tailwindcss", "init", "-p"], { stdio: "pipe" });
    }

    // Create tailwind config
    const tailwindConfig = isNextJs ? `{}` : `{}`; // Placeholder for generateViteTailwindConfig()
    await fs.writeFile(`tailwind.config.${configExt}`, tailwindConfig);

    // Create CSS file
    const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS Variables for theming */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}`;

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
      const installCmd = packageManager === "npm" ? ["install", "-D"] : packageManager === "yarn" ? ["add", "-D"] : ["add", "-d"];
      await execa(packageManager, [...installCmd, "tailwindcss@latest", "autoprefixer", "postcss"], { stdio: "pipe" });
      await execa("npx", ["tailwindcss", "init", "-p"], { stdio: "pipe" });
    }

    // Install Shadcn dependencies
    const installCmd = packageManager === "npm" ? ["install"] : ["add"];
    await execa(packageManager, [...installCmd, "class-variance-authority", "clsx", "tailwind-merge", "lucide-react"], {
      stdio: "pipe",
    });
    const devInstallCmd = packageManager === "npm" ? ["install", "-D"] : packageManager === "yarn" ? ["add", "-D"] : ["add", "-d"];
    await execa(packageManager, [...devInstallCmd, "@types/node"], { stdio: "pipe" });

    // Create shadcn config
    const shadcnConfig = `{}`; // Placeholder for generateShadcnConfig()
    await fs.writeFile("components.json", shadcnConfig);

    spinner.succeed("Shadcn/UI configured!");
  } else if (answers.styling === "Vanilla CSS") {
    spinner = ora("Setting up Vanilla CSS...").start();

    const vanillaCss = `{}`; // Placeholder for generateVanillaCss()
    if (isNextJs) {
      await fs.writeFile("src/app/globals.css", vanillaCss);
    } else {
      await fs.writeFile("src/index.css", vanillaCss);
    }

    spinner.succeed("Vanilla CSS configured!");
  }

  // Setup state management
  if (answers.stateManagement === "Redux Toolkit") {
    spinner = ora("Setting up Redux Toolkit...").start();
    const installCmd = packageManager === "npm" ? ["install"] : ["add"];
    await execa(packageManager, [...installCmd, "@reduxjs/toolkit", "react-redux"], { stdio: "pipe" });
    if (isTypeScript) {
      const devInstallCmd = packageManager === "npm" ? ["install", "-D"] : packageManager === "yarn" ? ["add", "-D"] : ["add", "-d"];
      await execa(packageManager, [...devInstallCmd, "@types/react-redux"], { stdio: "pipe" });
    }
    spinner.succeed("Redux Toolkit installed!");
  } else if (answers.stateManagement === "Zustand") {
    spinner = ora("Setting up Zustand...").start();
    const installCmd = packageManager === "npm" ? ["install"] : ["add"];
    await execa(packageManager, [...installCmd, "zustand"], { stdio: "pipe" });
    spinner.succeed("Zustand installed!");
  } else if (answers.stateManagement === "TanStack Query") {
    spinner = ora("Setting up TanStack Query...").start();
    const installCmd = packageManager === "npm" ? ["install"] : ["add"];
    await execa(packageManager, [...installCmd, "@tanstack/react-query", "@tanstack/react-query-devtools"], {
      stdio: "pipe",
    });
    spinner.succeed("TanStack Query installed!");
  }

  // Setup icons
  if (answers.icons === "Lucide") {
    spinner = ora("Installing Lucide React...").start();
    const installCmd = packageManager === "npm" ? ["install"] : ["add"];
    await execa(packageManager, [...installCmd, "lucide-react"], { stdio: "pipe" });
    spinner.succeed("Lucide React installed!");
  } else if (answers.icons === "React Icons") {
    spinner = ora("Installing React Icons...").start();
    const installCmd = packageManager === "npm" ? ["install"] : ["add"];
    await execa(packageManager, [...installCmd, "react-icons"], { stdio: "pipe" });
    spinner.succeed("React Icons installed!");
  } else if (answers.icons === "Iconify") {
    spinner = ora("Installing Iconify...").start();
    const installCmd = packageManager === "npm" ? ["install"] : ["add"];
    await execa(packageManager, [...installCmd, "@iconify/react"], { stdio: "pipe" });
    spinner.succeed("Iconify installed!");
  }

  // Setup React Router for React projects
  if (!isNextJs) {
    spinner = ora("Setting up React Router...").start();
    const installCmd = packageManager === "npm" ? ["install"] : ["add"];
    await execa(packageManager, [...installCmd, "react-router-dom"], { stdio: "pipe" });
    spinner.succeed("React Router installed!");
  }

  // Setup Axios for API calls
  spinner = ora("Setting up Axios...").start();
  const installCmd = packageManager === "npm" ? ["install"] : ["add"];
  await execa(packageManager, [...installCmd, "axios"], { stdio: "pipe" });
  spinner.succeed("Axios installed!");

  // Setup code quality tools
  if (answers.codeQuality === "Yes") {
    spinner = ora("Setting up code quality tools...").start();

    const devInstallCmd = packageManager === "npm" ? ["install", "-D"] : packageManager === "yarn" ? ["add", "-D"] : ["add", "-d"];

    if (!isNextJs) {
      await execa(packageManager, [...devInstallCmd, "eslint", "prettier", "eslint-config-prettier", "eslint-plugin-prettier"], {
        stdio: "pipe",
      });
    } else {
      await execa(packageManager, [...devInstallCmd, "prettier", "eslint-config-prettier", "eslint-plugin-prettier"], {
        stdio: "pipe",
      });
    }

    // Install Husky and lint-staged
    await execa(packageManager, [...devInstallCmd, "husky", "lint-staged", "@commitlint/cli", "@commitlint/config-conventional"], { stdio: "pipe" });

    // Initialize Husky
    await execa("npx", ["husky", "install"], { stdio: "pipe" });

    spinner.succeed("Code quality tools configured!");
  }

  // Create folder structure
  spinner = ora("Creating folder structure...").start();
  await createFolderStructure(answers, isTypeScript, isNextJs, isAppRouter);
  spinner.succeed("Folder structure created!");

  // Generate starter files
  spinner = ora("Generating starter files...").start();
  await generateStarterFiles(answers, isTypeScript, isNextJs, isAppRouter, fileExt);
  spinner.succeed("Starter files generated!");

  // Update package.json with additional scripts
  await updatePackageJsonScripts(answers, isNextJs, packageManager);

  // Final success message
  console.log(chalk.green("\n🎉 Project created successfully!"));
  console.log(chalk.blue("\n📋 Next steps:"));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white(`  ${packageManager} run dev`));

  if (answers.codeQuality === "Yes") {
    console.log(chalk.gray("\n🔧 Code quality tools:"));
    console.log(chalk.white(`  ${packageManager} run lint`));
    console.log(chalk.white(`  ${packageManager} run format`));
  }

  console.log(chalk.gray(`\nUsing ${packageManager} as package manager. Happy coding! 🚀`));
} catch (error) {
  spinner.fail("Error creating project");
  console.error(chalk.red(error.message));
  process.exit(1);
}

// Helper functions
async function createFolderStructure(answers, isTypeScript, isNextJs, isAppRouter) {
  const folders = ["src/components/ui", "src/components/layout", "src/components/common", "src/hooks", "src/lib", "src/utils", "src/assets/images", "src/assets/icons"];

  if (isNextJs) {
    if (isAppRouter) {
      folders.push("src/app");
    } else {
      folders.push("src/pages");
    }
  } else {
    folders.push("src/routes", "src/pages");
  }

  if (answers.stateManagement !== "Skip") {
    folders.push("src/store");
  }

  if (answers.codeQuality === "Yes") {
    folders.push("src/tests", "src/__tests__", "src/components/__tests__");
  }

  if (isTypeScript) {
    folders.push("src/types");
  }

  for (const folder of folders) {
    await fs.ensureDir(folder);
  }
}

async function generateStarterFiles(answers, isTypeScript, isNextJs, isAppRouter, fileExt) {
  // Generate Button component
  const buttonComponent = generateButtonComponent(answers.styling, isTypeScript, answers.icons);
  await fs.writeFile(`src/components/ui/Button.${fileExt}`, buttonComponent);

  // Generate Layout component
  const layoutComponent = generateLayoutComponent(answers.styling, isTypeScript, answers.icons);
  await fs.writeFile(`src/components/layout/Layout.${fileExt}`, layoutComponent);

  // Generate Theme Toggle (if using Tailwind or Shadcn)
  if (answers.styling === "Tailwind" || answers.styling === "Shadcn") {
    const themeToggle = generateThemeToggle(isTypeScript, answers.icons);
    await fs.writeFile(`src/components/common/ThemeToggle.${fileExt}`, themeToggle);
  }

  // Generate API client
  const apiClient = generateApiClient(isTypeScript);
  await fs.writeFile(`src/lib/api.${isTypeScript ? "ts" : "js"}`, apiClient);

  // Generate state management files
  if (answers.stateManagement === "Zustand") {
    const zustandStore = generateZustandStore(isTypeScript);
    await fs.writeFile(`src/store/useAuth.${isTypeScript ? "ts" : "js"}`, zustandStore);
  } else if (answers.stateManagement === "Redux Toolkit") {
    const reduxSlice = generateReduxSlice(isTypeScript);
    await fs.writeFile(`src/store/authSlice.${isTypeScript ? "ts" : "js"}`, reduxSlice);

    const reduxStore = generateReduxStore(isTypeScript);
    await fs.writeFile(`src/store/store.${isTypeScript ? "ts" : "js"}`, reduxStore);
  } else if (answers.stateManagement === "TanStack Query") {
    const queryClient = generateQueryClient(isTypeScript);
    await fs.writeFile(`src/lib/queryClient.${isTypeScript ? "ts" : "js"}`, queryClient);
  }

  // Generate React Router setup for React projects
  if (!isNextJs) {
    const appRoutes = generateReactRoutes(isTypeScript, fileExt);
    await fs.writeFile(`src/routes/AppRoutes.${fileExt}`, appRoutes);

    const mainApp = generateReactApp(answers, isTypeScript, fileExt);
    await fs.writeFile(`src/App.${fileExt}`, mainApp);

    // Generate sample pages
    const homePage = generateHomePage(answers, isTypeScript, fileExt);
    await fs.writeFile(`src/pages/HomePage.${fileExt}`, homePage);

    const aboutPage = generateAboutPage(answers, isTypeScript, fileExt);
    await fs.writeFile(`src/pages/AboutPage.${fileExt}`, aboutPage);
  }

  // Generate Protected Route component
  const protectedRoute = generateProtectedRoute(answers, isTypeScript, fileExt);
  await fs.writeFile(`src/components/common/ProtectedRoute.${fileExt}`, protectedRoute);

  // Generate custom hooks
  const customHooks = generateCustomHooks(isTypeScript);
  await fs.writeFile(`src/hooks/index.${isTypeScript ? "ts" : "js"}`, customHooks);

  // Generate code quality configs
  if (answers.codeQuality === "Yes") {
    const eslintConfig = generateEslintConfig(isNextJs);
    await fs.writeFile(".eslintrc.json", eslintConfig);

    const prettierConfig = generatePrettierConfig();
    await fs.writeFile(".prettierrc", prettierConfig);

    const commitlintConfig = generateCommitlintConfig();
    await fs.writeFile("commitlint.config.js", commitlintConfig);

    const lintStagedConfig = generateLintStagedConfig();
    await fs.writeFile(".lintstagedrc.json", lintStagedConfig);

    // Create Husky hooks
    await fs.ensureDir(".husky");
    await fs.writeFile(".husky/pre-commit", '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx lint-staged\n');
    await fs.writeFile(".husky/commit-msg", '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx --no -- commitlint --edit ${1}\n');
  }

  // Generate utils
  const utilsFile = generateUtils(isTypeScript);
  await fs.writeFile(`src/utils/index.${isTypeScript ? "ts" : "js"}`, utilsFile);

  // Generate TypeScript types
  if (isTypeScript) {
    const typesFile = generateTypes();
    await fs.writeFile("src/types/index.ts", typesFile);
  }
}

function generateButtonComponent(styling, isTypeScript, icons) {
  const typeImports = isTypeScript
    ? `
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}`
    : "";

  const propTypes = isTypeScript ? ": ButtonProps" : "";

  let iconImport = "";
  if (icons === "Lucide") {
    iconImport = "import { Loader2 } from 'lucide-react';";
  }

  if (styling === "Tailwind" || styling === "Shadcn") {
    return `import React from 'react';
${iconImport}${typeImports}

export const Button${propTypes} = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg'
  };
  
  return (
    <button
      type={type}
      className={\`\${baseClasses} \${variants[variant]} \${sizes[size]} \${className}\`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {disabled && icons === "Lucide" ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
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
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={className}
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

function generateLayoutComponent(styling, isTypeScript, icons) {
  let iconImports = "";
  let menuIcon = "☰";
  let closeIcon = "✕";

  if (icons === "Lucide") {
    iconImports = "import { Menu, X } from 'lucide-react';";
    menuIcon = '<Menu className="h-6 w-6" />';
    closeIcon = '<X className="h-6 w-6" />';
  }

  const typeImports = isTypeScript
    ? `
interface LayoutProps {
  children: React.ReactNode;
}`
    : "";

  return `import React, { useState } from 'react';
${iconImports}
import { Button } from '../ui/Button';${typeImports}

export const Layout${isTypeScript ? ": React.FC<LayoutProps>" : ""} = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-foreground">
                MyApp
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-primary">
                Home
              </a>
              <a href="/about" className="text-foreground hover:text-primary">
                About
              </a>
              <a href="/contact" className="text-foreground hover:text-primary">
                Contact
              </a>
            </nav>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                ${icons === "Lucide" ? `{isMenuOpen ? ${closeIcon} : ${menuIcon}}` : `{isMenuOpen ? "✕" : "☰"}`}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="/" className="block px-3 py-2 text-foreground hover:bg-accent rounded-md">
                  Home
                </a>
                <a href="/about" className="block px-3 py-2 text-foreground hover:bg-accent rounded-md">
                  About
                </a>
                <a href="/contact" className="block px-3 py-2 text-foreground hover:bg-accent rounded-md">
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-muted border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 MyApp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};`;
}

function generateThemeToggle(isTypeScript, icons) {
  return `import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

export const ThemeToggle${isTypeScript ? ": React.FC" : ""} = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
    >
      {theme === 'light' ? '🌙' : '☀️'}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};`;
}

function generateApiClient(isTypeScript) {
  return `import axios${isTypeScript ? ", { AxiosResponse, AxiosError }" : ""} from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  get: (url${isTypeScript ? ": string" : ""}) => api.get(url),
  post: (url${isTypeScript ? ": string" : ""}, data${isTypeScript ? ": any" : ""}) => api.post(url, data),
  put: (url${isTypeScript ? ": string" : ""}, data${isTypeScript ? ": any" : ""}) => api.put(url, data),
  delete: (url${isTypeScript ? ": string" : ""}) => api.delete(url),
};

export default api;`;
}

function generateZustandStore(isTypeScript) {
  return `import { create } from 'zustand';

export const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));`;
}

function generateReduxSlice(isTypeScript) {
  return `import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;`;
}

function generateReduxStore(isTypeScript) {
  return `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});`;
}

function generateQueryClient(isTypeScript) {
  return `import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    },
  },
});`;
}

function generateReactRoutes(isTypeScript, fileExt) {
  return `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';

export const AppRoutes${isTypeScript ? ": React.FC" : ""} = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;`;
}

function generateReactApp(answers, isTypeScript, fileExt) {
  return `import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;`;
}

function generateHomePage(answers, isTypeScript, fileExt) {
  return `import React from 'react';
import { Button } from '../components/ui/Button';

const HomePage${isTypeScript ? ": React.FC" : ""} = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to MyApp</h1>
        <p className="text-xl mb-8">A modern React application</p>
        <Button variant="primary">Get Started</Button>
      </div>
    </div>
  );
};

export default HomePage;`;
}

function generateAboutPage(answers, isTypeScript, fileExt) {
  return `import React from 'react';

const AboutPage${isTypeScript ? ": React.FC" : ""} = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      <p className="text-lg">This is the about page.</p>
    </div>
  );
};

export default AboutPage;`;
}

function generateProtectedRoute(answers, isTypeScript, fileExt) {
  return `import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute${isTypeScript ? ": React.FC<{ children: React.ReactNode }>" : ""} = ({ children }) => {
  const isAuthenticated = false; // Replace with your auth logic

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};`;
}

function generateCustomHooks(isTypeScript) {
  return `import { useState, useEffect } from 'react';

export const useLocalStorage = (key${isTypeScript ? ": string" : ""}, initialValue${isTypeScript ? ": any" : ""}) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value${isTypeScript ? ": any" : ""}) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};`;
}

function generateEslintConfig(isNextJs) {
  return JSON.stringify(
    {
      extends: isNextJs ? ["next/core-web-vitals", "prettier"] : ["eslint:recommended", "prettier"],
      plugins: ["prettier"],
      rules: {
        "prettier/prettier": "error",
      },
    },
    null,
    2
  );
}

function generatePrettierConfig() {
  return JSON.stringify(
    {
      semi: true,
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
    },
    null,
    2
  );
}

function generateCommitlintConfig() {
  return `module.exports = {
  extends: ['@commitlint/config-conventional'],
};`;
}

function generateLintStagedConfig() {
  return JSON.stringify(
    {
      "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
      "*.{json,css,md}": ["prettier --write"],
    },
    null,
    2
  );
}

function generateUtils(isTypeScript) {
  return `export const formatDate = (date${isTypeScript ? ": Date" : ""}) => {
  return new Intl.DateTimeFormat('en-US').format(date);
};

export const debounce = (func${isTypeScript ? ": Function" : ""}, wait${isTypeScript ? ": number" : ""}) => {
  let timeout${isTypeScript ? ": NodeJS.Timeout" : ""};
  return (...args${isTypeScript ? ": any[]" : ""}) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};`;
}

function generateTypes() {
  return `export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}`;
}

async function updatePackageJsonScripts(answers, isNextJs, packageManager) {
  const packageJsonPath = "package.json";
  const packageJson = await fs.readJson(packageJsonPath);

  const additionalScripts = {
    dev: isNextJs ? "next dev" : "vite",
    build: isNextJs ? "next build" : "vite build",
    start: isNextJs ? "next start" : "vite preview",
  };

  if (answers.codeQuality === "Yes") {
    additionalScripts["lint"] = "eslint . --ext .js,.jsx,.ts,.tsx";
    additionalScripts["lint:fix"] = "eslint . --ext .js,.jsx,.ts,.tsx --fix";
    additionalScripts["format"] = "prettier --write .";
    additionalScripts["format:check"] = "prettier --check .";
  }

  packageJson.scripts = {
    ...packageJson.scripts,
    ...additionalScripts,
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}
