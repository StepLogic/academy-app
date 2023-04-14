// import { useUIContext } from "@contexts/UIContext";
import { theme } from "@assets/theme";

import * as React from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";

import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";

type Props = {
  className?: string;
  setIsSelected?: (value: any) => void;
  value: any;
  disabled: boolean;
  isSelected: boolean;
  id: string;
  progress: number;
  translate: any;
  exclude: boolean;
} & TouchableOpacityProps;
const Slot = (props: Props) => {
  const measure = React.useRef<any>({});

  const [selected, setSelected] = useState(props.isSelected);
  const value = new Animated.Value(0);

  return (
    <TouchableOpacity
      style={[
        {
          alignItems: "center",
          height: "100%",
          justifyContent: "center",
          backgroundColor: props.exclude
            ? theme.colors.pink
            : selected
            ? theme.colors.green
            : props.progress === 0
            ? theme.colors.pink
            : "transparent",
        },
        styles.root,
        props.progress !== 0 &&
          selected !== true &&
          !props.exclude && {
            borderColor: theme.colors.white,
            borderStyle: "solid",
            borderWidth: 1,
          },
      ]}
      onPress={() => {
        props.setIsSelected &&
          props.setIsSelected({
            id: props.id,
          });
        setSelected((r) => !r);
      }}
      {...props}
    >
      {props.exclude ? (
        <Entypo name="cross" size={24} color={theme.colors.onPink} />
      ) : selected ? (
        <Entypo name="check" size={24} color={theme.colors.onButtonGreen} />
      ) : (
        props.progress === 0 && (
          <Entypo name="cross" size={24} color={theme.colors.onPink} />
        )
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    marginBottom: 5,
    marginRight: 5,
    height: 25,
    maxHeight: 26,
    minHeight: 23,
    borderRadius: 5,
  },
});

export default Slot;
