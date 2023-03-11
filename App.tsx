import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "@screens/auth/ForgotPassword";
import Login from "@screens/auth/Login";
import NewPassword from "@screens/auth/NewPassword";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  View,
} from "react-native";
import { Provider as PaperProvider, Snackbar } from "react-native-paper";

import { Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PERSISTENCE_KEY = "NAVIGATION_STATE_V1";
import { theme } from "./assets/theme";
import Dashboard from "@screens/dashboard";
import StateManager from "src/api/context/AppContext";
import { useAppContext } from "./src/api/context/AppContext";
import { useEffect } from "react";
import { initial } from "lodash";
import SplashAnimation from "@components/SplashAnimation";
import Typography from "@components/common/Typography";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const AppContent = () => {
  const { error, showSnack, setShowSnack, user, showSplash } = useAppContext();
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

  if (!fontsLoaded) {
    return <SplashAnimation />;
  }
  // return <SplashAnimation />;
  if (showSplash) return <SplashAnimation />;
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          flex: 1,
        }}
        onLayout={onLayoutRootView}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user === null ? (
            <>
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
            </>
          ) : (
            <>
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
        {/* {showSnack === true && (
          <View
            style={[
              {
                width: 100 * theme.vw,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: 0,
                borderRadius: 8,
                height: 40,
                backgroundColor: theme.colors.secondary,
                zIndex: 200,
                margin: 10,
                right: 0,
              },
            ]}
          >
            <ActivityIndicator animating={true} color={theme.colors.green} />
          </View>
        )} */}
        <Snackbar
          style={{
            backgroundColor: theme.colors.secondary,
            // color: theme.colors.red,
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
  useEffect(() => {}, [initialState]);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        // if (Platform.OS !== "web" && initialUrl == null) {
        // Only restore state if there's no deep link and we're not on web
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;

        if (state !== undefined) {
          setInitialState(state);
        }
        // }
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
