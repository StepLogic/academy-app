// import { TextInput as RNPTextInput } from "react-native-paper";
import { Keyboard, StyleSheet, View } from "react-native";
import {
  TextInput,
  TextInputProps,
  useTheme,
  HelperText,
} from "react-native-paper";
import Typography from "./Typography";
import { theme } from "assets/theme";
import { useState } from "react";
import { useController } from "react-hook-form";
type Props = {
  password?: boolean;

  name: string;
  control?: any;
} & TextInputProps;
function TextField(props: Props) {
  const {
    style,
    label,
    password,
    control,
    name,
    placeholderTextColor,
    underlineColor,
    activeOutlineColor,
    ...rest
  } = props;
  const theme = useTheme();
  const [secureTextEntry, setSecureTextEntry] = useState(password || false);
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
  });

  return (
    <View style={[styles.root, style]}>
      {label && (
        <Typography
          style={[
            styles.label,
            {
              color: Boolean(error?.message)
                ? theme.colors.error
                : theme.colors.secondary,
            },
          ]}
          variant="labelLarge"
        >
          {label}
        </Typography>
      )}
      <TextInput
        value={field.value}
        onEndEditing={() => Keyboard.dismiss()}
        onChangeText={field.onChange}
        secureTextEntry={secureTextEntry}
        textColor={theme.colors.secondary}
        mode="flat"
        underlineColor={
          underlineColor || (theme.colors as any).textUnderlineColorLight
        }
        placeholderTextColor={placeholderTextColor || "#CCCCCC"}
        activeUnderlineColor={
          activeOutlineColor || Boolean(error?.message)
            ? theme.colors.error
            : theme.colors.primary
        }
        style={[styles.rootInput]}
        contentStyle={[{ width: "100%", flex: 1 }]}
        {...rest}
        right={
          password && (
            <TextInput.Icon
              color={theme.colors.secondary}
              icon={secureTextEntry ? "eye" : "eye-off"}
              onPress={() => {
                setSecureTextEntry(!secureTextEntry);
                return false;
              }}
            />
          )
        }
      />
      <HelperText type="error" visible={Boolean(error) || Boolean(invalid)}>
        {error?.message}
      </HelperText>
    </View>
  );
}
export default TextField;
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
    color: theme.colors.secondary,
    textAlign: "auto",
  },
  label: {
    // fontWeight: "700",
    fontFamily: "Poppins-Medium",
  },
});
