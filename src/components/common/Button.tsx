import { theme } from "@assets/theme";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { ButtonProps } from "react-native-paper";
import { Button as BaseButton } from "react-native-paper";

type Props = {} & ButtonProps;

const Button = (props: Props) => {
  const {
    style,
    uppercase = true,
    children,
    labelStyle,
    contentStyle,
    ...rest
  } = props;
  return (
    <BaseButton
      uppercase={uppercase ? true : false}
      labelStyle={[labelStyle, styles.labelStyle]}
      {...rest}
      style={[{ borderRadius: 11 }, style]}
      contentStyle={[styles.root, contentStyle]}
    >
      {children}
    </BaseButton>
  );
};
export default Button;
const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: theme.vw < 300 ? 49 : 59,
  },
  labelStyle: {
    fontWeight: "600",
    fontSize: theme.vw < 300 ? 18 : 24,
    lineHeight: 24,
    fontFamily: "Poppins-Semibold",
  },
});
