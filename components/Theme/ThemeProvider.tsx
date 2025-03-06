'use client';


// import { ThemeProvider as NextThemeProvider } from 'next-themes';
// import { type ThemeProviderProps } from 'next-themes/dist/types';

// export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
//     return (
//         <NextThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             {...props}
//         >
//             {children}
//         </NextThemeProvider>
//     );
// } 

// import { createContext, useContext, useState, useEffect } from 'react';

// const ThemeContext = createContext();

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState('light');

//   // Synchronize theme state with HTML data attribute
//   useEffect(() => {
//     document.documentElement.dataset.theme = theme;
//   }, [theme]);

//   // Provide theme context to children
//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// // Custom hook for easy theme access
// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// }