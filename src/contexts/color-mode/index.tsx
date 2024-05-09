"use client";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { RefineThemes } from "@refinedev/mui";
import { TypographyVariantsOptions, createTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import "@styles/font/Nunito.css";

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

type ColorModeContextProviderProps = {
  defaultMode?: string;
};

const typography: TypographyVariantsOptions = {
  fontFamily: [
    "Nunito",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
};

export const ColorModeContextProvider: React.FC<
  PropsWithChildren<ColorModeContextProviderProps>
> = ({ children, defaultMode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState(defaultMode || "light");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const systemTheme = useMediaQuery(`(prefers-color-scheme: dark)`);

  useEffect(() => {
    if (isMounted) {
      const theme = Cookies.get("theme") || (systemTheme ? "dark" : "light");
      setMode(theme);
    }
  }, [isMounted, systemTheme]);

  const toggleTheme = () => {
    const nextTheme = mode === "light" ? "dark" : "light";

    setMode(nextTheme);
    Cookies.set("theme", nextTheme);
  };

  const theme = createTheme({
    // ...(mode === "light" ? RefineThemes.Blue : RefineThemes.BlueDark),
    palette: {
      background: {
        default: "#F7F8FB",
      },
      primary: {
        main: "#F15858",
      },
      secondary: {
        main: "#2775EC",
        light: "#F0F6FF",
      },
    },
    typography: {
      ...typography,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: "white",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "capitalize",
            paddingTop: 12,
            paddingBottom: 12,
          },
        },
      },
    },
  });

  return (
    <ColorModeContext.Provider
      value={{
        setMode: toggleTheme,
        mode,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
