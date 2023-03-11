// import { useUIContext } from "@contexts/UIContext";
import Button from "@components/common/Button";
import TextField from "@components/common/TextField";
import Typography from "@components/common/Typography";
import AuthPageHeader from "@components/headers/AuthPageHeader";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Images from "@res/images";
import { theme } from "assets/theme";
import * as React from "react";
import { Image, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import tw from "twrnc";

const NewPassword = () => {
  // const app = useUIContext();
  const navigate = useNavigation();
  const requirements = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "Minimum 8 characters",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "One uppercase letter",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "One lowercase letter",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d7dfgg32",
      title: "One number",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29fg72",
      title: "One special character (#?!@$%^&*-)",
    },
  ];
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
              placeholderTextColor={theme.colors.primary}
              placeholder="*********"
              label={"New Password"}
              password
            />
          </View>
          <View style={tw`mb-4`}>
            {requirements.map((item) => (
              <View
                key={item.id}
                style={[
                  { padding: 0, margin: 0, color: theme.colors.red },
                  tw`flex flex-row items-center justify-between`,
                ]}
              >
                <Typography style={{ color: theme.colors.red }}>
                  {item.title}
                </Typography>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color={theme.colors.red}
                />
              </View>
            ))}
          </View>
          <Button
            buttonColor={theme.colors.button}
            mode="contained"
            onPress={() => navigate.navigate("dashboard")}
          >
            confirm
          </Button>
          {/* <View style={tw`flex-row flex items-center mt-4 justify-center`}>
            <FontAwesome5 name="key" size={24} color={theme.colors.secondary} />
            <TouchableOpacity
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
            </TouchableOpacity>
          </View> */}
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

export default NewPassword;
