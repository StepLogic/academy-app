import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import { ButtonProps } from "react-native-paper";
import { Button as BaseButton } from "react-native-paper";
import Typography from "./Typography";
import tw from "twrnc";
import { theme } from "@assets/theme";

type Props = {
  showButton?: boolean;
  heading: string;
  subHeading: string;
  prompt: string;
  value: string;
  onPress?: Function;
  buttonAffix?: React.ReactNode;
} & ViewProps;

const ItemCard = (props: Props) => {
  const { style, children, ...rest } = props;
  return (
    <View {...rest} style={[{ borderRadius: 11 }, styles.root, style]}>
      <View style={tw`flex-col flex-3 mr-2`}>
        <Typography numberOfLines={1} style={[styles.heading]}>
          {props.heading}
        </Typography>
        <Typography style={[tw`my-[1px]`, styles.subHeading]}>
          {props.subHeading}
        </Typography>
        <View style={tw`flex-row items-center`}>
          <Typography style={[styles.prompt]}>{props.prompt + ":"}</Typography>
          <Typography style={[styles.value]}>{props.value}</Typography>
        </View>
      </View>
      {props.showButton && (
        <TouchableOpacity
          style={tw`flex-1 flex-row items-center`}
          onPress={() => props.onPress && props.onPress()}
        >
          <Typography style={styles.buttonText}>View</Typography>
          {props?.buttonAffix}
        </TouchableOpacity>
      )}
    </View>
  );
};
export default ItemCard;
const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: 100,
    borderRadius: 7,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    color: theme.colors.primary,
    fontSize: 25,
    maxHeight: 30,
    fontFamily: "Poppins-Semibold",
    flex: 1,
  },
  subHeading: {
    fontSize: 15 + theme.vh * 0.01,
    height: 23 + theme.vh * 0.01,
    fontFamily: "Poppins-Semibold",
    color: theme.colors.secondary,
  },
  prompt: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    marginRight: 4,
    height: 23 + theme.vh * 0.01,
  },
  value: {
    fontSize: 15 + theme.vh * 0.01,
    fontFamily: "Poppins-Semibold",
    color: theme.colors.secondary,
    height: 23 + theme.vh * 0.01,
  },
  buttonText: {
    fontFamily: "Poppins-Semibold",
    fontSize: 20,
    textTransform: "uppercase",
    color: theme.colors.primary,
    marginRight: 5,
  },
});
