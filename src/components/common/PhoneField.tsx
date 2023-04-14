// import { TextInput as RNPTextInput } from "react-native-paper";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TextInput as BaseTextInput,
  View,
} from "react-native";
import {
  HelperText,
  TextInput,
  TextInputProps,
  useTheme,
} from "react-native-paper";
import { MaskedTextInput } from "react-native-mask-text";
import Typography from "./Typography";
import { theme } from "assets/theme";
import { useState } from "react";
import { CountryPicker } from "react-native-country-codes-picker";
import tw from "twrnc";
import { useController } from "react-hook-form";

type Props = { control?: any; name: string } & TextInputProps;
function PhoneField(props: Props) {
  const {
    style,
    label,
    control,
    name,
    placeholderTextColor,
    underlineColor,
    activeOutlineColor,
    ...rest
  } = props;
  const theme = useTheme();
  // const [countryCode, setCountry] = useState<any>("FR");
  const [country, setCountry] = useState<any>({ dial_code: "+39", flag: "🇮🇹" });
  const [visible, setVisible] = useState(false);
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
  });

  const removeCountryCode = (value: string) => {
    const arr = value?.split(" ").reverse();
    arr?.pop();
    return arr?.join("");
  };
  return (
    <View style={[styles.root, style]}>
      {label && (
        <Typography style={styles.label} variant="labelLarge">
          {label}
        </Typography>
      )}

      <TextInput
        value={removeCountryCode(field.value)}
        onChangeText={(value) =>
          field.onChange(`${country.dial_code} ${value}`)
        }
        mode="flat"
        textColor={theme.colors.secondary}
        underlineColor={
          underlineColor || (theme.colors as any).textUnderlineColorLight
        }
        placeholderTextColor={placeholderTextColor || "#CCCCCC"}
        activeUnderlineColor={
          activeOutlineColor || Boolean(error?.message)
            ? theme.colors.error
            : theme.colors.primary
        }
        {...rest}
        style={[styles.root]}
        render={(inputProps) => (
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              style={{
                backgroundColor: "transparent",
                height: 58,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setVisible(true)}
            >
              <Typography
                style={{ fontSize: 20 }}
              >{`${country.flag} ${country.dial_code}`}</Typography>
            </TouchableOpacity>
            <BaseTextInput
              {...inputProps}
              keyboardType={"phone-pad"}
              style={[
                inputProps.style,
                styles.rootInput,
                {
                  flex: 1,
                  width: "100%",
                  marginHorizontal: 0,
                },
              ]}
            />
          </View>
        )}
      />
      <HelperText type="error" visible={Boolean(error) || Boolean(invalid)}>
        {error?.message}
      </HelperText>
      <CountryPicker
        lang="it"
        show={visible}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={(item: any) => {
          setCountry({ flag: item.flag, dial_code: item.dial_code });
          setVisible(false);
        }}
      />
    </View>
  );
}
export default PhoneField;
const styles = StyleSheet.create({
  root: {
    width: "100%",
    backgroundColor: "transparent",
    color: theme.colors.secondary,
  },
  rootInput: {
    borderRadius: 8,
    borderStyle: "solid",
    width: "100%",
    height: 59,
    flexDirection: "row",
    paddingLeft: 0,
    // paddingHorizontal: theme.inputPaddingHorizontal,
    // backgroundColor: theme.colors.primary,
    // paddingVertical: theme.inputPaddingVertical,
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "flex-start",
    fontSize: 20,
    fontFamily: "Poppins-Medium",
  },
  label: {
    color: theme.colors.secondary,
    // fontWeight: "700",
    fontFamily: "Poppins-Medium",
  },
});
