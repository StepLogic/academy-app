import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import { Dimensions } from "react-native";
export const theme = {
  ...MD3LightTheme,
  inputPaddingVertical: 0,
  inputPaddingHorizontal: 0,
  vh: Dimensions.get("window").height * 0.01,
  vw: Dimensions.get("window").width * 0.01,
  // Specify a custom property in nested object
  colors: {
    ...MD3LightTheme.colors,
    primary: "#8065C9",
    onPrimary: "#fff",

    secondary: "#2D224C",
    onSecondary: "#fff",

    lightPrimary: "#D9DAF3",
    onLightPrimary: "#8065C9",

    red: "#E90000",
    onRed: "#ffffff",

    green: "#74DFAC",
    onGreen: "#fff",

    button: "#D4145A",
    onButton: "#fff",

    message: "#4CAF50",

    white: "#ffffff",
    fadedWhite: "#CCCCCC",
    grey: "#D3D3D3",

    pink: "#FF8C8C",
    onPink: "#861313",

    buttonGreen: "#74DFA",
    onButtonGreen: "#31602A",
    textUnderlineColorLight: "#0000006b",

    primaryBlue: "#2D224C",
  },
};
