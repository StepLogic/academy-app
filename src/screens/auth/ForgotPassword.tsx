// import { useUIContext } from "@contexts/UIContext";
import Button from "@components/common/Button";
import TextField from "@components/common/TextField";
import Typography from "@components/common/Typography";
import AuthPageHeader from "@components/headers/AuthPageHeader";
import { FontAwesome5 } from "@expo/vector-icons";
import Images from "@res/images";
import { theme } from "assets/theme";
import * as React from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

const ForgotPassword = () => {
  // const app = useUIContext();
  const navigate = useNavigation();
  return (
    <View style={styles.root}>
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <View style={[tw`px-[${5 * theme.vw}] flex-col`]}>
          <AuthPageHeader />

          <View
            style={tw`text-center font-semibold mt-[${5 * theme.vh}] mb-[${
              6 * theme.vh
            } flex items-center`}
          >
            <Typography
              variant="headlineLarge"
              style={[
                {
                  color: theme.colors.secondary,
                  fontFamily: "Poppins-Semibold",
                },
              ]}
            >
              Change your {"\n"} password here
            </Typography>
            <Image source={Images.forgotPasswordIllustration} />
          </View>
          <View style={tw`flex flex-col mb-8`}>
            <TextField
              placeholder="name@example.com"
              placeholderTextColor={theme.colors.primary}
              label={"Email address"}
              style={tw`mb-2`}
            />
          </View>
          <Button
            buttonColor={theme.colors.button}
            mode="contained"
            style={tw``}
            onPress={() => navigate.navigate("NewPassword")}
          >
            RESET PASSWORD
          </Button>
          <View style={tw`flex-row flex items-center mt-4 justify-center`}>
            <FontAwesome5 name="key" size={24} color={theme.colors.secondary} />
            <TouchableHighlight
              onPress={() => navigate.navigate("Login")}
              style={[tw`mt-auto`, { marginLeft: 8 }]}
            >
              <Typography
                style={{
                  color: theme.colors.secondary,
                  textDecorationLine: "underline",
                }}
                variant="titleMedium"
              >
                Back to login
              </Typography>
            </TouchableHighlight>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: 8 * theme.vh,
    paddingBottom: 6 * theme.vh,
  },
  lowerSection: {
    flex: 4,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ForgotPassword;
