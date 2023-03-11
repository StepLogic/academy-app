// import { useUIContext } from "@contexts/UIContext";
import { theme } from "@assets/theme";
import Typography from "@components/common/Typography";
import Images from "@res/images";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import FastImage from "react-native-fast-image";
import Button from "@components/common/Button";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLayoutLogic } from "@api/context/LayoutContext";
import { useNavigation, useRoute } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";
import { CaStars } from "@components/common/Icons";
import { TextInput } from "react-native-paper";
import { Motion, AnimatePresence } from "@legendapp/motion";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Checkbox } from "react-native-paper";
import { useAppContext } from "@api/context/AppContext";

export const feedbackOptions = [
  "Tutor",
  "App",
  "Content of the class",
  "Organisation of the class",
  "Slides and Exercises",
];

const PageOne = ({ handleNext, onSubmit, setFeedback }) => {
  const [stars, setStars] = useState(0);
  const {
    user: { user },
    loading,
  } = useAppContext();
  return (
    <>
      <Typography
        style={[
          {
            fontSize: 24,
            color: theme.colors.secondary,
            fontFamily: "Poppins-Semibold",
          },
          tw`mb-[${2 * theme.vh}]`,
        ]}
      >
        How was your speaking class?
      </Typography>
      <View style={tw`flex-row justify-center items-center w-full `}>
        {Array.from({ length: 5 }).map((r, idx) => (
          <TouchableOpacity
            key={"stars_" + idx}
            style={tw`mr-2`}
            onPress={() => {
              setStars(idx + 1);
              setFeedback((r) => {
                return {
                  ...r,
                  rating: idx + 1,
                };
              });
            }}
          >
            <CaStars
              style={[
                {
                  color:
                    idx + 1 <= stars
                      ? theme.colors.secondary
                      : theme.colors.grey,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <ScrollView>
          <TextInput
            onEndEditing={() => Keyboard.dismiss()}
            multiline={true}
            activeUnderlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.primary}
            style={[styles.textArea, tw`flex-4`]}
            outlineColor={theme.colors.grey}
            outlineStyle={{
              borderRadius: 19,
            }}
            mode="outlined"
            onChangeText={(value) =>
              setFeedback((r) => {
                return {
                  ...r,
                  first_feedback: value,
                };
              })
            }
          />
          <View style={[{ width: "100%" }]}>
            <Button
              style={[{ width: "100%" }]}
              textColor={theme.colors.white}
              disabled={stars === 0 || loading}
              buttonColor={theme.colors.button}
              onPress={() => {
                if (stars < 4) {
                  handleNext();
                  return;
                }

                onSubmit && onSubmit();
              }}
            >
              Send
            </Button>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
};

const PageTwo = ({
  handleNext,
  selectedOptions,
  handleChange,
  setFeedback,
  onSubmit,
}) => {
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherTextField, setOtherTextField] = useState(null);

  const validate = () => {
    if (otherSelected) {
      return otherTextField !== null && otherTextField?.target?.value !== "";
    }
    return selectedOptions && selectedOptions.length > 0;
  };

  const Check = (props) => <Checkbox.Android {...props} />;
  return (
    <>
      <Typography
        style={[
          {
            fontSize: 24,
            color: theme.colors.secondary,
            fontFamily: "Poppins-Semibold",
          },
          tw`mb-[${2 * theme.vh}]`,
        ]}
      >
        How was your speaking class?
      </Typography>
      <KeyboardAwareScrollView style={[{ width: "100%" }]}>
        {feedbackOptions.map((r, idx) => (
          <View
            key={"indx" + idx}
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              },
            ]}
          >
            <Check
              status={selectedOptions.includes(r) ? "checked" : "unchecked"}
              onPress={() =>
                handleChange({ name: r, checked: !selectedOptions.includes(r) })
              }
            />
            <Typography
              style={[
                {
                  fontSize: 20,
                  color: theme.colors.secondary,
                  fontFamily: "Poppins-Regular",
                },
              ]}
            >
              {r}
            </Typography>
          </View>
        ))}
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            },
          ]}
        >
          <Check
            status={otherSelected ? "checked" : "unchecked"}
            onPress={() => {
              if (!otherSelected) {
                setOtherTextField(null);
              }
              setOtherSelected((r) => !r);
            }}
          />
          <TextInput
            placeholder="Other..."
            placeholderTextColor={theme.colors.grey}
            outlineColor={theme.colors.white}
            activeOutlineColor={theme.colors.white}
            style={[
              {
                fontSize: 20,
                fontFamily: "Poppins-Regular",
                backgroundColor: "transparent",
              },
            ]}
            mode="outlined"
            onChangeText={(e) => setOtherTextField(e)}
            value={otherTextField}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={[{ width: "100%", marginTop: "auto" }]}>
        <Button
          style={[{ width: "100%" }]}
          textColor={theme.colors.white}
          buttonColor={theme.colors.button}
          disabled={!validate()}
          onPress={() => {
            // closeModal();
            const valueOptionOther = [];
            if (otherSelected) {
              handleChange({
                checked: true,
                name: otherTextField,
              });

              valueOptionOther.push(otherTextField);
            }
            let filteredSelected = selectedOptions.filter((r) =>
              feedbackOptions.includes(r)
            );
            if (filteredSelected.length > 0) {
              setFeedback((r) => {
                return {
                  ...r,
                  improvements: [...selectedOptions, ...valueOptionOther],
                };
              });
              handleNext && handleNext();
              return;
            }

            onSubmit && onSubmit([...valueOptionOther]);
          }}
        >
          Send
        </Button>
      </View>
    </>
  );
};
const PageThree = ({ handleNext, selectedOptions, setFeedback, onSubmit }) => {
  const { loading } = useAppContext();
  const formatText = () => {
    let filteredSelected = selectedOptions.filter((r) =>
      feedbackOptions.includes(r)
    );

    if (filteredSelected.length === 0) return "";
    if (filteredSelected.length === 2) {
      return `with ${filteredSelected[0]} and ${filteredSelected[1]}`.toLowerCase();
    }
    if (filteredSelected.length === 1) {
      return `with ${filteredSelected[0]}`.toLowerCase();
    }
    return `with ${filteredSelected
      .slice(0, filteredSelected.length - 1)
      .join(" ,")} and ${filteredSelected.at(-1)}`.toLowerCase();
  };

  return (
    <>
      <Typography
        style={[
          {
            fontSize: 24,
            color: theme.colors.secondary,
            fontFamily: "Poppins-Semibold",
          },
          tw`mb-[${2 * theme.vh}]`,
        ]}
      >
        {`What problem/s did you have ${formatText()}?`}
      </Typography>
      <KeyboardAwareScrollView
        style={[{ width: "100%", height: "100%" }, tw`flex-4 mt-auto`]}
      >
        <ScrollView>
          <TextInput
            multiline={true}
            activeUnderlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.primary}
            style={[styles.textArea]}
            outlineColor={theme.colors.grey}
            outlineStyle={{
              borderRadius: 19,
            }}
            mode="outlined"
            onChangeText={(value) =>
              setFeedback((r) => {
                return {
                  ...r,
                  last_feedback: value,
                };
              })
            }
          />
          <View style={[{ width: "100%" }]}>
            <Button
              style={[{ width: "100%" }]}
              disabled={loading}
              textColor={theme.colors.white}
              buttonColor={theme.colors.button}
              onPress={() => {
                onSubmit && onSubmit();
              }}
            >
              Send
            </Button>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
};

const Feedback = ({ route }) => {
  //Context
  const { setBurgerButton, setBgColor } = useLayoutLogic();
  const {
    user: { user },
    createFeedback,
  } = useAppContext();

  const [feedback, setFeedback] = useState({
    id_user: user?.id,
    id_evento: route?.params?.id,
    rating: null,
    first_feedback: null,
    last_feedback: null,
  });

  const [pages, setPages] = useState(1);
  const navigate = useNavigation();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const createNewFeedback = (improvements) => {
    Keyboard.dismiss();
    improvements
      ? createFeedback({
          ...feedback,
          improvements: improvements,
        })
      : createFeedback({
          ...feedback,
          improvements: JSON.stringify(feedback?.improvements),
        });
  };
  const handleChange = (payload) => {
    let exSelected = [...selectedOptions];
    const { name, checked } = payload;
    if (exSelected.includes(name)) {
      if (!checked) {
        exSelected = exSelected.filter((r) => r !== name);
      }
    } else {
      exSelected.push(name);
    }
    setSelectedOptions(exSelected);
    setFeedback({ ...feedback, improvements: [...selectedOptions] });
    Keyboard.dismiss();
  };

  const handleGoBack = () => {
    setPages((r) => r - 1);
  };

  useEffect(() => {
    if (pages === 0) {
      navigate.goBack();
      setFeedback({
        id_user: user?.id,
        id_evento: route?.params?.id,
        rating: null,
        first_feedback: null,
        last_feedback: null,
      });
      setSelectedOptions([]);
      setPages(1);
      Keyboard.dismiss();
    }
  }, [pages]);

  useEffect(() => {
    if (
      navigate.getState().routeNames[navigate.getState().index] === "Feedback"
    ) {
      setBgColor(theme.colors.white);
      setBurgerButton(
        <TouchableOpacity onPress={() => handleGoBack()}>
          <Feather
            name="chevron-left"
            size={24}
            color={theme.colors.secondary}
          />
        </TouchableOpacity>
      );
    }
    return () => {
      setBurgerButton(null);
      setBgColor(theme.colors.secondary);
    };
  }, [navigate.getState().index]);

  return (
    <AnimatePresence>
      {pages === 1 && (
        <Motion.View
          key="A"
          initial={{ opacity: 0.1, x: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.2, x: -theme.vw * 100 }}
          style={styles.root}
        >
          <PageOne
            setFeedback={setFeedback}
            handleNext={() => setPages(2)}
            onSubmit={createNewFeedback}
          />
        </Motion.View>
      )}
      {pages === 2 && (
        <Motion.View
          key="B"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.2 }}
          style={styles.root}
          transition={{
            default: {
              type: "spring",
            },
            opacity: {
              type: "timing",
            },
          }}
        >
          <PageTwo
            handleNext={() => setPages(3)}
            setFeedback={setFeedback}
            selectedOptions={selectedOptions}
            handleChange={handleChange}
            onSubmit={createNewFeedback}
          />
        </Motion.View>
      )}
      {pages === 3 && (
        <Motion.View
          key="C"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.2 }}
          style={styles.root}
          transition={{
            default: {
              type: "spring",
            },
            opacity: {
              type: "timing",
            },
          }}
        >
          <PageThree
            setFeedback={setFeedback}
            selectedOptions={selectedOptions}
            onSubmit={createNewFeedback}
          />
        </Motion.View>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textArea: {
    height: 40 * theme.vh,
    width: "100%",
    borderRadius: 19,
    marginVertical: theme.vh * 5,
    maxHeight: 325,
    backgroundColor: theme.colors.white,
  },
  label: {
    fontSize: 13,
    height: 18,
    fontFamily: "Poppins-Regular",
  },
  value: {
    fontSize: 20,
    height: 24,
    fontFamily: "Poppins-Semibold",
  },
  white: {
    color: theme.colors.white,
  },

  secondary: {
    color: theme.colors.secondary,
  },
});

export default Feedback;
