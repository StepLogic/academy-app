import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "@api/Api";
import AuthContext from "./Authcontext";
import Cookie from "js-cookie";

const setCookie = (cookiename, data) => {
  Cookie.set(cookiename, data, {
    expires: 365,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
};

const getCookie = (cookiename) => {
  return Cookie.get(cookiename);
};

const rmCookie = (cookiename) => {
  return Cookie.remove(cookiename);
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  //LOGIN
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authTk, setAuthTk] = useState(null);
  const [events, setEvents] = useState(null);
  const [availabilities, setAvailabilities] = useState(null);
  const [exercises, setExercises] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [materials, setMaterials] = useState(null);

  const handleLogin = async (userData) => {
    try {
      setLoading(true);
      const { data } = await Api.post("v1/login", userData);
      const user = data.user;
      const events = data.events;
      const token = user.token;
      setCookie("academy", data?.auth);
      setAuthTk(data?.auth);
      const availabilities = data.availabilities;
      setUser(user);
      if (typeof data.exercises.toDo) {
        data.exercises.toDo = Object.values(data.exercises.toDo);
      }
      setExercises(data?.exercises);
      setEvents(events);
      setToken(token);
      setAvailabilities(availabilities);
      setMaterials(data?.materials);
      setLoading(false);
      const origin = location.state?.from?.pathname || "/dashboard/agenda";
      navigate(origin, { replace: true });
    } catch (error) {
      console.log("error.data", error.message);
      setErrorMessage(error.message);
      setError(error.response.data);
      setLoading(false);
    }
  };

  const handleAuthentication = async () => {
    const tk = getCookie("academy");

    if (tk == null || tk == undefined) {
      const origin = "/";
      navigate(origin, { replace: true });
    }

    try {
      setLoading(true);
      Api.defaults.headers["Authorization"] = `Bearer ${tk}`;
      const { data } = await Api.post("v1/authenticate/user");

      const user = data.user;
      const events = data.events;
      const token = user.token;
      const tokenAuth = getCookie("academy");
      setAuthTk(tokenAuth);
      const availabilities = data.availabilities;
      setUser(user);
      if (typeof data.exercises.toDo) {
        data.exercises.toDo = Object.values(data.exercises.toDo);
      }
      setMaterials(data?.materials);
      setExercises(data?.exercises);
      setEvents(events);
      setToken(token);
      setAvailabilities(availabilities);
      setLoading(false);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setLoading(false);
      const origin = "/";
      navigate(origin, { replace: true });
    }
  };

  const handleLogout = async () => {
    const { data } = await Api.post("v1/authenticated/log-out");
    if (data?.logout) {
      setAuthTk(null);
      rmCookie("academy");
      navigate("/");
    }

    console.log(data);
  };

  //LOGIN END

  //RESET PASSWORD

  const resetPasswordHandler = async (data) => {
    try {
      const response = await Api.post("v1/reset", data);
      setResponse(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  //RESET PASSWORD END

  //NEW PASSWORD

  const newPasswordHandler = async (data, token) => {
    try {
      const response = await Api.post("v1/" + token + "/update", data);
      const risp = response.data;
      navigate("/", { state: { message: "Password change successfull!" } });
    } catch (error) {
      setError(error.response.data.errors.password[0]);
    }
  };

  //NEW PASSWORD END

  //LANGUAGE

  const [language, setLanguage] = useState("english");

  //LANGUAGE END

  //FORM
  const updateHandler = async (data, token) => {
    try {
      // setLoading(true);
      setError(false);
      const response = await Api.post("v1/" + token + "/update", data);
      setResponse(response.data);
      return response;
      // setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      // setLoading(false);
    }
  };

  //take name
  const findUser = async (token) => {
    try {
      setLoading(true);
      const response = await Api.post("v1/" + token);
      const user = response.data[0];
      Number(user) ? navigate("/") : null;
      setUser(user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  const updateEventCheckIn = async (id) => {
    const { data } = await Api.post("v1/check-in/" + id);

    return data;
  };

  const getFile = async (id, type = "media") => {
    const { data } = await Api.post(
      "v1/get-file/" + id,
      { type },
      {
        responseType: "blob",
      }
    );

    return data;
  };

  const correctExercise = async (ex, id) => {
    const { data } = await Api.post("v1/correct-exercise/" + id, ex);

    return data;
  };

  const updateAvailability = async (availability) => {
    const { data } = await Api.post("v1/availability/updateA", availability);

    return data;
  };

  const value = {
    language,
    loading,
    events,
    setLoading,
    setLanguage,
    error,
    errorMessage,
    setError,
    navigate,
    user,
    setUser,
    token,
    response,
    availabilities,
    setAvailabilities,
    onFindUser: findUser,
    onNewPassword: newPasswordHandler,
    onUpdateUser: updateHandler,
    onReset: resetPasswordHandler,
    onLogin: handleLogin,
    onLogout: handleLogout,
    setCookie,
    getCookie,
    rmCookie,
    authTk,
    exercises,
    updateEventCheckIn,
    handleAuthentication,
    getFile,
    correctExercise,
    setExercises,
    updateAvailability,
    materials,
  };

  React.useEffect(() => {
    if (!authTk) return;
    Api.defaults.headers = {
      Authorization: `Bearer ${authTk}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
  }, [authTk]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
