import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import { ButtonProps } from "react-native-paper";
import { Button as BaseButton } from "react-native-paper";
import Typography from "./Typography";
import tw from "twrnc";
import { theme } from "../../../assets/theme";

type Props = {
  heading: string;
} & ViewProps;

const NoItemCard = (props: Props) => {
  const { style, children, ...rest } = props;
  return (
    <View {...rest} style={[{ borderRadius: 11 }, styles.root, style]}>
      <Typography style={[styles.heading]}>{props.heading}</Typography>
    </View>
  );
};
export default NoItemCard;
const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: 90,
    borderRadius: 7,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    borderColor: theme.colors.white,
    borderWidth: 2,
  },
  heading: {
    color: theme.colors.white,
    fontSize: 19,
    height: 30,
    fontFamily: "Poppins-Regular",
  },
});
