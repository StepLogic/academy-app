import Button from "@components/common/Button";
import TextField from "@components/common/TextField";
import Typography from "@components/common/Typography";
import AuthPageHeader from "@components/headers/AuthPageHeader";
import { FontAwesome5 } from "@expo/vector-icons";

import { theme } from "assets/theme";
import React from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppContext } from "@api/context/AppContext";
import { useMediaQuery } from "react-responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const Login = () => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });
  const isMediumHeight = useMediaQuery({ maxHeight: 600 });

  const navigate = useNavigation();
  const { handleLogin, loading } = useAppContext();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: any) => {
    handleLogin(data);
    Keyboard.dismiss();
  };
  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView style={styles.content}>
        <View style={[tw`px-[${5 * theme.vw}] flex-col`]}>
          <AuthPageHeader />
          {
            <Typography
              variant={isMediumHeight ? "titleLarge" : "headlineLarge"}
              style={[
                tw`text-center font-semibold mt-[${5 * theme.vh}] mb-[${
                  6 * theme.vh
                }]`,
                {
                  color: theme.colors.secondary,
                  fontFamily: "Poppins-Semibold",
                },
              ]}
            >
              Hey 👋 {"\n"} Good to see you!
            </Typography>
          }

          <View style={tw` flex flex-col mb-${isMediumHeight ? "1" : "8"}`}>
            <TextField
              placeholder="name@example.com "
              placeholderTextColor={theme.colors.primary}
              label={"Email address"}
              name="email"
              control={control}
              style={tw` mb-2`}
            />
            <TextField
              placeholderTextColor={theme.colors.primary}
              placeholder="*********"
              label={"Password"}
              name={"password"}
              control={control}
              password
            />
          </View>

          <Button
            buttonColor={theme.colors.button}
            mode="contained"
            style={tw``}
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          >
            log in
          </Button>
          <View style={tw`flex-row flex items-center mt-4  justify-center`}>
            <FontAwesome5
              name="key"
              size={theme.vh * 100 < 600 ? 16 : 24}
              color={theme.colors.secondary}
            />
            <TouchableHighlight
              onPress={() => navigate.navigate("ForgotPassword")}
              style={[tw`mt-auto`, { marginLeft: 8 }]}
            >
              <Typography
                style={{
                  color: theme.colors.secondary,
                  textDecorationLine: "underline",
                }}
                variant={isMediumHeight ? "titleSmall" : "titleMedium"}
              >
                Reset your password
              </Typography>
            </TouchableHighlight>
          </View>

          <View style={tw`flex-row flex items-center mt-4 justify-center`}>
            <TouchableOpacity
              onPress={() => navigate.navigate("Register")}
              style={[tw`mt-auto`, { marginLeft: 8 }]}
            >
              <Typography
                style={{
                  color: theme.colors.secondary,
                  textDecorationLine: "underline",
                }}
                variant={isMediumHeight ? "titleSmall" : "titleMedium"}
              >
                Don't have an account? Sign up
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // width: theme.vw * 100,
    flexDirection: "column",
    backgroundColor: theme.colors.lightPrimary,
    position: "relative",
    // alignItems: "center",
  },
  content: {
    flex: 8,
    paddingTop: 3 * theme.vh,
    paddingBottom: 4 * theme.vh,
  },
  lowerSection: {
    flex: 4,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Login;
