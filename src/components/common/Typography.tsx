// import { TextInput as RNPTextInput } from "react-native-paper";
import { ReactNode, forwardRef } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text, TextProps } from "react-native-paper";

export type TypographyProps = {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  variant?:
    | "displayLarge"
    | "displayMedium"
    | "displaySmall"
    | "headlineLarge"
    | "headlineMedium"
    | "headlineSmall"
    | "titleLarge"
    | "titleMedium"
    | "titleSmall"
    | "labelLarge"
    | "labelMedium"
    | "labelSmall"
    | "bodyLarge"
    | "bodyMedium"
    | "bodySmall";
} & TextProps;
export type TypographyRef = typeof Text;
const Typography = forwardRef<TypographyRef, TypographyProps>((props, ref) => {
  const { style, children, ...rest } = props;
  return (
    <Text style={[styles.root, style]} ref={ref} {...rest}>
      {`${children}`.split(",").join("")}
    </Text>
  );
});
export default Typography;
const styles = StyleSheet.create({
  root: {
    fontFamily: "Poppins-Medium",
    elevation: 10,
    zIndex: 3,
  },
});
