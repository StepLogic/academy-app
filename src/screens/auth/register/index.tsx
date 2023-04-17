import Typography from "@components/common/Typography";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import Images from "@res/images";
import { theme } from "assets/theme";
import axios from "axios";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Snackbar } from "react-native-paper";
import tw from "twrnc";
import UserInfo from "./UserInfo";
import ScheduleMeeting from "./ScheduleMeeting";
import { useMediaQuery } from "react-responsive";

// import CalendarPicker from "react-native-calendar-picker";
export const BASE_URL = "https://api.edusogno.com/api/admin/v1";
interface StepProps {
  nextStep?: () => void;
  showError: (message: string) => void;
  meetings?: object[];
}

const Register = () => {
  const [step, setStep] = React.useState(0);
  const [showSnack, setShowSnack] = React.useState(false);
  const [error, setError] = React.useState("");
  const [meetings, setMeetings] = React.useState([]);
  const navigate = useNavigation();
  const isMediumHeight = useMediaQuery({ maxHeight: 600 });
  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const showError = (error: string) => {
    setError(error);
    setShowSnack(true);
  };

  const fetchMeetings = async () => {
    try {
      const res = await axios.post(BASE_URL + "/calendar-events", {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      });
      console.log(res.data[0]);
      setMeetings(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    // fetchMeetings();
  }, []);

  return (
    <KeyboardAwareScrollView style={styles.root}>
      <View style={styles.content}>
        <Image
          style={{
            width: theme.vw * 100,
            height: !isMediumHeight ? theme.vh * 94 : theme.vh * 80,
            position: "absolute",
            zIndex: -1,
          }}
          source={Images.registerBackground}
          resizeMode={"cover"}
        />
        <View style={styles.topSection}>
          <TouchableOpacity
            style={{ position: "absolute", top: theme.vh * 2, left: 10 }}
            onPress={() => navigate.goBack()}
          >
            <AntDesign
              name="arrowleft"
              size={!isMediumHeight ? 24 : 10}
              color={theme.colors.white}
            />
          </TouchableOpacity>
          <Typography
            style={[
              tw`text-center font-bold mt-[${2 * theme.vh}] mb-[${
                2 * theme.vh
              }]`,
              {
                fontSize:
                  theme.vh * 100 < 600
                    ? 18 + theme.vh * 0.5
                    : 28 + theme.vh * 0.5,

                color: theme.colors.white,
                fontFamily: "Poppins-Semibold",
              },
            ]}
          >
            {step == 0
              ? "Vuoi migiorare il tuo inlgese?"
              : "Fissa il colloquio di selezione"}
          </Typography>

          <Typography
            style={[
              tw`text-center mt-[${1 * theme.vh}] mb-[${4 * theme.vh}]`,
              {
                fontSize:
                  theme.vh * 100 < 600
                    ? 12 + theme.vh * 0.2
                    : 14 + theme.vh * 0.5,
                color: theme.colors.white,
                fontFamily: "Poppins-Medium",
              },
            ]}
          >
            {step == 0
              ? " Lasciaci il tuo contatto e ti richiameremo"
              : "Non devi preoccuparti, sarà easy"}
          </Typography>
          <View style={styles.managerInfo}>
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                borderColor: theme.colors.primary,
                borderWidth: 3,
              }}
              source={Images.selenaPng}
              resizeMode={"cover"}
            />
            <View style={tw`flex-col justify-center ml-4`}>
              <Typography
                style={[
                  {
                    fontSize: 20,
                    color: theme.colors.white,
                    fontFamily: "Poppins-Semibold",
                    lineHeight: 22,
                  },
                ]}
              >
                Serena
              </Typography>
              <Typography
                style={[
                  {
                    fontSize: 12,
                    color: theme.colors.white,
                    fontFamily: "Poppins-medium",
                  },
                ]}
              >
                Admission Manager @Edusogno
              </Typography>
            </View>
          </View>
        </View>
        <View style={styles.lowerSection}>
          {step === 0 ? (
            <UserInfo nextStep={nextStep} showError={showError} />
          ) : (
            <ScheduleMeeting meetings={meetings} showError={showError} />
          )}
        </View>
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
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // width: theme.vw * 100,
    flexDirection: "column",
    // backgroundColor: theme.colors.secondary,
    position: "relative",
    backgroundColor: theme.colors.white,
    // alignItems: "center",
  },

  content: {
    flex: 1,
    // paddingBottom: 4 * theme.vh,
    position: "relative",
  },
  lowerSection: {
    height: theme.vh * 100 > 600 ? theme.vh * 48 : theme.vh * 52,
    paddingBottom: 20,
    width: theme.vw * 100,
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
  },
  topSection: {
    height: theme.vh * 100 > 600 ? theme.vh * 46 : theme.vh * 38,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // backgroundColor: theme.colors.secondary,
  },
  managerInfo: {
    flexDirection: "row",
  },

  secondSection: {
    // width: theme.vw * 100,
    // height: theme.vh * 50,
    flex: 1,
  },
});

export default Register;
