import "@expo/match-media";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "@screens/auth/ForgotPassword";
import Login from "@screens/auth/Login";
import NewPassword from "@screens/auth/NewPassword";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { Dimensions, SafeAreaView, View } from "react-native";
import { Provider as PaperProvider, Snackbar } from "react-native-paper";

import { Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { theme } from "./assets/theme";
import Dashboard from "@screens/dashboard";

import StateManager, { useAppContext } from "./src/api/context/AppContext";

import SplashAnimation from "@components/SplashAnimation";

import Register from "@screens/auth/register";
SplashScreen.preventAutoHideAsync();
const PERSISTENCE_KEY = "NAVIGATION_STATE_V1";
const Stack = createNativeStackNavigator();
const AppContent = () => {
  const { error, showSnack, setShowSnack, user, showSplash, setShowSplash } =
    useAppContext();

  const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Semibold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
    "DM Sans": require("./assets/fonts/DM_Sans/DMSans-Medium.ttf"),
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return <SplashAnimation />;

  if (showSplash) return <SplashAnimation setShowSplash={setShowSplash} />;

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          backgroundColor: theme.colors.primary,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          flex: 1,
        }}
        onLayout={onLayoutRootView}
      >
        {user === null && (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NewPassword"
              component={NewPassword}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        )}

        {user !== null && <Dashboard />}

        <Snackbar
          style={{
            backgroundColor: theme.colors.secondary,
          }}
          duration={4000}
          visible={showSnack}
          onDismiss={() => {
            setShowSnack(false);
          }}
        >
          {error}
        </Snackbar>
      </SafeAreaView>
    </PaperProvider>
  );
};
export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();
  const [isR, setISR] = React.useState(false);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;

        if (state !== undefined) {
          setInitialState(state);
        }
      } finally {
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return <SplashAnimation />;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => {
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
      }}
      onReady={() => setISR(true)}
    >
      <StateManager isReady={isReady && isR}>
        <AppContent />
      </StateManager>
    </NavigationContainer>
  );
}
