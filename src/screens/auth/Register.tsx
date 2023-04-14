import Typography from "@components/common/Typography";
import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Keyboard,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { theme } from "assets/theme";
import tw from "twrnc";
import TextField from "@components/common/TextField";
import { Button, FAB, Snackbar } from "react-native-paper";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, get } from "react-hook-form";
import PhoneField from "@components/common/PhoneField";
import axios from "axios";
// import CalendarPicker from "react-native-calendar-picker";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Images from "@res/images";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Calendar } from "react-native-calendars";
import moment, { Moment } from "moment";
export const BASE_URL = "https://api.edusogno.com/api/admin/v1";
import { ToggleButton } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
interface StepProps {
  nextStep?: () => void;
  showError: (message: string) => void;
  meetings?: object[];
}

const Registration = ({ nextStep, showError }: StepProps) => {
  const [loading, setLoading] = React.useState(false);

  const [steps, setSteps] = useState(0);

  const schema = yup.object().shape({
    email: yup.string().email("Email non valido").required(),
    name: yup.string().required("Nome richiesta"),
    lname: yup.string().required("Cognome richiesta"),
    phone: yup
      .string()
      .required()
      .matches(
        /^[\+]?[(]?[ \0-9]{4}[)]?[-\s\.]?[ \0-9]{4}[-\s\.]?[ \0-9]{6,8}$/gm,
        "Telefono non valido"
      ),
  });

  const navigate = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getFieldState,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const nextFormStep = async () => {
    if (steps == 0) {
      const res = await trigger(["name", "lname"]);
      if (res && Object.values(errors).length === 0) {
        setSteps((r) => r + 1);
        return;
      }
    }
    if (steps == 1) {
      const res = await trigger("phone");
      if (res && Object.values(errors).length === 0) {
        setSteps((r) => r + 1);
        return;
      }
    }
    if (steps == 2) {
      const res = await trigger("email");
      if (res && Object.values(errors).length === 0) {
        handleSubmit(onSubmit)();
        return;
      }
    }
  };

  const submitData = async (data: any) => {
    console.log(BASE_URL + "/cr");
    try {
      const res = await axios.post(BASE_URL + "/crm", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (typeof nextStep === "function") {
        nextStep();
      }
    } catch (error) {
      showError("Qualcosa é andato storto, riprova piú tardi");
    }

    setLoading(false);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    data = {
      ...data,
      phone: data.phone.replace(/\s/g, ""),
      offer: "Edusogno - app",
      status: "Nuovo",
    };
    console.log({ data });
    submitData(data);
    Keyboard.dismiss();
  };
  return (
    <>
      <View style={[tw`px-[${5 * theme.vw}] flex-col pt-4`]}>
        {steps === 0 && (
          <>
            <TextField
              placeholder="Mario"
              placeholderTextColor={theme.colors.primary}
              label={"Qual é il tuo nome?"}
              name="name"
              control={control}
              style={tw` mb-2`}
            />
            <TextField
              placeholder="Rossi"
              placeholderTextColor={theme.colors.primary}
              label={"Qual è il tuo cognome?"}
              name="lname"
              control={control}
              style={tw` mb-2`}
            />
          </>
        )}

        {steps == 1 && (
          <PhoneField
            name="phone"
            control={control}
            placeholderTextColor={theme.colors.primary}
            label={"Qual è il tuo numero di telefono?"}
            placeholder="1234567890"
            style={tw` my-auto`}
          />
        )}
        {steps === 2 && (
          <TextField
            placeholder="name@example.com "
            placeholderTextColor={theme.colors.primary}
            label={"Qual è la tua email?"}
            name="email"
            control={control}
            style={tw` mb-2`}
          />
        )}
      </View>

      <View style={tw`flex-row justify-center items-center`}>
        {steps !== 0 && (
          <FAB
            color={theme.colors.white}
            style={[styles.directionButton, tw`mr-4`]}
            small
            onPress={() => setSteps((r) => r - 1)}
            icon={"chevron-left"}
          />
        )}
        <FAB
          color={theme.colors.white}
          small
          style={styles.directionButton}
          loading={loading}
          onPress={() => nextFormStep()}
          icon={"chevron-right"}
        />
      </View>
    </>
  );
};
const HourButton = () => {
  const [tap, setTap] = useState(false); // "stylesheet.calendar.day.basic": {
  //   base: {
  //     width: theme.vw > 300 ? 32 : 22,
  //     height: theme.vw > 300 ? 32 : 22,
  //     alignItems: "center",
  //     backgroundColor: theme.colors.primary,
  //   },
  // },
  return (
    <View style={tw`flex-row items-center`}>
      <Button
        style={{
          borderColor: theme.colors.primary,
          borderRadius: 4,
          width: tap ? "30%" : "100%",
          backgroundColor: theme.colors.white,
        }}
        contentStyle={{}}
        onPress={() => setTap((r) => !r)}
        mode={tap ? "contained" : "outlined"}
      >
        <Typography
          style={{
            color: tap ? theme.colors.white : theme.colors.primary,
            fontFamily: "Poppins-Medium",
            fontSize: 14,
          }}
        >
          09:00
        </Typography>
      </Button>
      {tap && (
        <Button
          style={{
            borderRadius: 4,
            width: "70%",
            marginLeft: 10,
            borderColor: theme.colors.green,
            elevation: 2,
          }}
          contentStyle={{}}
          onPress={() => setTap(true)}
          mode="outlined"
          buttonColor={theme.colors.green}
          textColor={theme.colors.buttonGreen}
        >
          <Typography
            style={{
              color: theme.colors.buttonGreen,
              fontFamily: "Poppins-Bold",
              fontSize: 14,
            }}
          >
            CONFERMA
          </Typography>
        </Button>
      )}
    </View>
  );
};
const ScheduleMeeting = ({ meetings, showError }: StepProps) => {
  const [loading, setLoading] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(moment());
  const [currentMonth, setCurrentMonth] = React.useState(moment().month());
  const month = moment().month();
  const [steps, setSteps] = useState(0);
  const [hours, setHours] = React.useState(null);

  const renderItem = React.useCallback(({ item }: any) => <HourButton />, []);
  return (
    <>
      <View
        style={[
          tw`flex-row justify-center items-center flex-1`,
          {
            // backgroundColor: theme.colors.buttonGreen,
          },
        ]}
      >
        {steps === 0 ? (
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(moment(day.dateString, "YYYY-MM-DD"));
              setSteps(1);
            }}
            minDate={moment().format("YYYY-MM-DD")}
            style={{
              //   height: theme.vh * 8,
              width: theme.vw * 80,
              borderTopEndRadius: 100,
              borderTopStartRadius: 100,
              //   paddingBottom: theme.vh * 6,
            }}
            textDayStyle={{
              marginTop: 0,
            }}
            //   markedDates={markedDates()}
            onMonthChange={(d) => {
              //   the d starts indexing at one but monet starts at 0
              setCurrentMonth(d.month - 1);
            }}
            disableArrowLeft={currentMonth == month}
            disableArrowRight={currentMonth >= month + 1}
            renderArrow={(direction) =>
              direction == "left" ? (
                <Entypo
                  name="chevron-left"
                  size={theme.vw > 300 ? 28 : 16}
                  color={
                    currentMonth === month ? "#00000060" : theme.colors.primary
                  }
                />
              ) : (
                <Entypo
                  name="chevron-right"
                  size={theme.vw > 300 ? 28 : 16}
                  color={
                    currentMonth >= month + 1
                      ? "#00000060"
                      : theme.colors.primary
                  }
                />
              )
            }
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: theme.colors.primary,
              textSectionTitleDisabledColor: "#d9e1e8",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              dayTextColor: theme.colors.secondary,
              textDisabledColor: "#00000060",
              selectedDotColor: "#ffffff",
              disabledArrowColor: "#d9e1e8",
              todayDotColor: theme.colors.secondary,
              todayTextColor: theme.colors.secondary,
              monthTextColor: theme.colors.primary,
              indicatorColor: "blue",
              textDayFontFamily: "Poppins-Regular",
              textMonthFontFamily: "Poppins-Semibold",
              textDayHeaderFontFamily: "Poppins-Regular",
              textDayFontSize: theme.vw > 300 ? 13 : 11,
              textDayStyle: {
                marginTop: 0,
                width: theme.vw > 300 ? 32 : 22,
                height: theme.vw > 300 ? 32 : 22,
              },
              textMonthFontSize: theme.vw > 300 ? 28 : 18,
              weekVerticalMargin: 2,
              textDayHeaderFontSize: theme.vw > 300 ? 13 : 11,
              "stylesheet.calendar.header": {
                week: {
                  marginTop: theme.vh * 2,
                  marginBottom: theme.vh * 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
                dayHeader: {
                  width: 36,
                  textAlign: "center",
                  color: theme.colors.primary,
                  textTransform: "uppercase",
                },
                header: {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingLeft: 10,
                  paddingRight: 10,
                  alignItems: "center",
                },
              },
              // "stylesheet.calendar.day.basic": {
              //   base: {
              //     width: theme.vw > 300 ? 32 : 22,
              //     height: theme.vw > 300 ? 32 : 22,
              //     alignItems: "center",
              //     backgroundColor: theme.colors.primary,
              //   },
              // },
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              // height: theme.vh * 58,
              //   backgroundColor: theme.colors.buttonGreen,
            }}
          >
            <View
              style={tw`flex flex-row items-center justify-center mb-${
                theme.vw > 300 ? "8" : "4"
              }  `}
            >
              <TouchableOpacity onPress={() => setSteps(0)}>
                <AntDesign
                  name="arrowleft"
                  size={theme.vw > 300 ? 24 : 16}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <Typography
                style={{
                  color: theme.colors.primary,
                  fontSize: theme.vw > 300 ? 24 : 18,
                  fontFamily: "Poppins-Semibold",
                  lineHeight: 32,
                  marginLeft: 10,
                }}
              >
                {selectedDate.format("dddd DD MMMM")}
              </Typography>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: theme.colors.lightPrimary,
                paddingHorizontal: theme.vw * 5,
                paddingVertical: theme.vh * 6,
              }}
            >
              <FlashList
                // contentContainerStyle={{
                //   flex: 1,
                // }}
                data={Array.from({ length: 10 })}
                renderItem={renderItem}
                estimatedItemSize={37}
                ItemSeparatorComponent={() => (
                  <View style={[{ marginVertical: 10 }]} />
                )}
              />
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const Register = () => {
  const [step, setStep] = React.useState(1);
  const [showSnack, setShowSnack] = React.useState(false);
  const [error, setError] = React.useState("");
  const [meetings, setMeetings] = React.useState([]);
  const navigate = useNavigation();
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
            height: theme.vw > 300 ? theme.vh * 94 : theme.vh * 80,
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
              size={theme.vw > 300 ? 24 : 10}
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
                  theme.vw < 300 ? 18 + theme.vh * 0.5 : 28 + theme.vh * 0.5,

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
                  theme.vw < 300 ? 12 + theme.vh * 0.2 : 14 + theme.vh * 0.5,
                color: theme.colors.white,
                fontFamily: "Poppins-medium",
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
            <Registration nextStep={nextStep} showError={showError} />
          ) : (
            <ScheduleMeeting meetings={meetings} showError={showError} />
          )}
        </View>
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
    height: theme.vw > 300 ? theme.vh * 38 : theme.vh * 52,
    width: theme.vw * 100,
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
  },
  topSection: {
    height: theme.vw > 300 ? theme.vh * 46 : theme.vh * 38,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // backgroundColor: theme.colors.secondary,
  },
  managerInfo: {
    flexDirection: "row",
  },
  directionButton: {
    borderRadius: 100,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.green,
  },
  secondSection: {
    // width: theme.vw * 100,
    // height: theme.vh * 50,
    flex: 1,
  },
});

export default Register;
