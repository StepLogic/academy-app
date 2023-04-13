import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import React, { Context, useContext, useEffect } from "react";
import Api from "../Api";
import { delay } from "lodash";
import * as SplashScreen from "expo-splash-screen";

const AppContext = React.createContext<Context>({
  navigate: (string: string) => { },
  goBack: () => { },
  user: null,
  handleLogin: () => { },
  loading: false,
  setLoading: () => { },
  showSnack: false,
  setShowSnack: () => { },
  error: "",
  handleLogout: () => { },
  updateUser: () => { },
  updateCheckIn: () => { },
  getRecording: () => { },
  refresh: () => { },
  showSplash: false,
});

export default function StateManager(props) {
  const { children, isReady } = props;
  const navigate = useNavigation();

  const [appUser, setUser] = React.useState<{
    user: any;
    events: any;
    exercises?: any;
    availabilities?: any;
    materials?: any;
    token?: any;
  } | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [showSnack, setShowSnack] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [showSplash, setShowSplash] = React.useState(false);

  useEffect(() => {
    if (isReady) {
      refresh(true);
    }
  }, [isReady]);

  const refresh = (showSplash?: boolean) => {
    if (showSplash) {
      setShowSplash(true);
    }
    getCookie("academy-auth").then((storedValue) => {
      if (storedValue && storedValue !== null) {
        handleAuthentication(storedValue);
      }
    });
  };

  // useEffect(() => {
  //   const idS = setTimeout(() => {
  //     setShowSnack(false);
  //   }, 3000);
  //   return () => {
  //     clearTimeout(idS);
  //   };
  // }, [showSnack]);

  const handleError = (error: any) => {
    console.log("erro", error);
    setShowSnack(true);
    setErrorMessage(error);
  };

  const handleLogin = async (userData: { email: string; password: string }) => {
    try {
      setLoading(true);
      const { data } = await Api.post("v1/login", userData);

      if (data) populateState(data);
    } catch (error) {
      handleError(error.response.data.message);
      setUser(null);
      setLoading(false);
    }
  };

  const handleAuthentication = async (tk: string) => {
    try {
      Api.defaults.headers["Authorization"] = `Bearer ${tk}`;
      const { data } = await Api.post("v1/authenticate/user");
      if (data) populateState(data);
    } catch (error) {
      handleError(error.message);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      setUser(null);
      await rmCookie("academy-auth");
      setLoading(false);
    } catch (e) {
      handleError("Check Internet Connection");
      console.log("error");
      setLoading(false);
    }
    await Api.post("v1/authenticated/log-out");
  };

  ///handle login persistence
  const setCookie = async (cookiename: string, data: string) => {
    try {
      await AsyncStorage.setItem(cookiename, data);
    } catch (e) {
      console.log("error.persist.set", e);
    }
  };

  const getCookie = async (cookiename: string) => {
    try {
      return await AsyncStorage.getItem(cookiename);
    } catch (e) {
      console.log("error.persist.get", e);
      // error reading value
    }
  };

  const rmCookie = async (cookiename: string) => {
    try {
      return await AsyncStorage.removeItem(cookiename);
    } catch (e) {
      console.log("error.persist.remove", e);
      // error reading value
    }
  };

  ///populate data
  const populateState = (
    { user, events, exercises, availabilities, materials, auth, token }: any,
    path?: string
  ) => {
    if (typeof exercises.toDo) {
      exercises.toDo = Object.values(exercises.toDo);
    }

    setUser({ user, events, exercises, availabilities, materials });
    if (auth !== null) setCookie("academy-auth", auth);
    const n = () => {
      setShowSplash(false);
    };
    delay(n, 5000);
    setLoading(false);
  };

  //RESET PASSWORD

  const resetPasswordHandler = async (data) => {
    try {
      const response = await Api.post("v1/reset", data);
      // setResponse(response.data);
    } catch (error) {
      // setError(error.response.data.message);
    }
  };

  const newPasswordHandler = async (data, token) => {
    try {
      const response = await Api.post("v1/" + token + "/update", data);
      const risp = response.data;
      // navigate("/", { state: { message: "Password change successfull!" } });
    } catch (error) {
      // setError(error.response.data.errors.password[0]);
    }
  };
  const updateUser = async (data, token) => {
    try {
      setLoading(true);
      const response = await Api.post("v1/" + token + "/update", data);
      setLoading(false);
      // setResponse(response.data);
      return response;
      // setLoading(false);
    } catch (error) {
      handleError(error);
      // setLoading(false);
    }
  };
  const updateEventCheckIn = async (id) => {
    const { data } = await Api.post("v1/check-in/" + id);
    return data;
  };

  const updateAvailability = async (availability) => {
    const { data } = await Api.post("v1/availability/updateA", availability);
    return data;
  };

  const createFeedback = async (feedback) => {
    setLoading(true);
    Api.post("v1/feedback/create", feedback)
      .then((r) => {
        navigate.goBack();
        setLoading(false);
        refresh(true);
      })
      .catch((err) => {
        console.log("error", err);
        handleError(JSON.stringify(err));
        setLoading(false);
      });
  };

  const getRecording = async (id) => {
    try {
      const { data } = await Api.post("v1/event-recording/" + id);
      return data;
    } catch (e) {
      handleError(JSON.stringify(e.message));
    }
  };

  //LANGUAGE
  const [language, setLanguage] = React.useState("english");

  // const getFile = async (id, type = "media") => {
  //   const { data } = await Api.post(
  //     "v1/get-file/" + id,
  //     { type },
  //     {
  //       responseType: "blob",
  //     }
  //   );

  //   return data;
  // };

  return (
    <AppContext.Provider
      value={{
        user: appUser,
        handleLogin,
        navigate: navigate.navigate,
        loading,
        setLoading,
        showSnack,
        setShowSnack,
        error: errorMessage,
        handleLogout,
        updateUser,
        updateEventCheckIn,
        getRecording,
        refresh,
        updateAvailability,
        createFeedback,
        showSplash,
        setShowSplash
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
