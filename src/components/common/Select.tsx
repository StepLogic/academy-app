// import { TextInput as RNPTextInput } from "react-native-paper";
import { StyleSheet, View, StyleProp, TextStyle } from "react-native";
import { TextInput, TextInputProps, useTheme } from "react-native-paper";
import { PaperSelect } from "react-native-paper-select";

import Typography from "./Typography";
import { useEffect, useState } from "react";
import { theme } from "assets/theme";
type Props = {} & TextInputProps;

export const selectValidator = (value: any) => {
  if (!value || value.length <= 0) {
    return "Please select a value.";
  }

  return "";
};
function Select(props: Props) {
  const {
    style,
    placeholderTextColor,
    underlineColor,
    activeOutlineColor,
    ...rest
  } = props;
  const theme = useTheme();
  const [gender, setGender] = useState<any>({
    value: "",
    list: [
      { _id: "1", value: "MALE" },
      { _id: "2", value: "FEMALE" },
      { _id: "3", value: "OTHERS" },
    ],
    selectedList: [],
    error: "",
  });

  useEffect(() => {
    let isMounted = true;
    let _getData = async () => {
      if (isMounted) {
        setGender({
          ...gender,
          value: "OTHERS",
          selectedList: [{ _id: "3", value: "OTHERS" }],
        });
      }
    };

    _getData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={[styles.root, style]}>
      <Typography style={styles.label} variant="labelLarge">
        width
      </Typography>
      <PaperSelect
        // label=""
        textInputMode="flat"
        underlineColor={
          underlineColor || (theme.colors as any).textUnderlineColorLight
        }
        activeUnderlineColor={activeOutlineColor || theme.colors.primary}
        textInputStyle={[styles.rootInput] as TextStyle}
        {...rest}
        value={gender.value}
        onSelection={(value: any) => {
          setGender({
            ...gender,
            value: value.text,
            selectedList: value.selectedList,
            error: "",
          });
        }}
        arrayList={[...gender.list]}
        selectedArrayList={[...gender.selectedList]}
        errorText={gender.error}
        multiEnable={false}
        textInputBackgroundColor="transparent"
      />
    </View>
  );
}
export default Select;
const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  rootInput: {
    borderRadius: 8,
    borderStyle: "solid",
    width: "100%",
    height: 59,
    flexDirection: "row",
    paddingHorizontal: theme.inputPaddingHorizontal,
    backgroundColor: "transparent",
    paddingVertical: theme.inputPaddingVertical,
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "flex-start",
    fontSize: 20,
    fontFamily: "Poppins-Medium",
  },
  label: {
    color: theme.colors.secondary,
    fontWeight: "700",
    fontFamily: "Poppins-Medium",
  },
});
