import { createMyNavigator } from "@components/Navigator";
import Typography from "@components/common/Typography";
import { theme } from "assets/theme";
import { Moment } from "moment";
import React, { useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import tw from "twrnc";
import { useEffect, useState } from "react";

type Props = {
  date: Moment;
};
const MonthHeader = ({ date }: Props) => {
  return (
    <Typography
      style={[
        {
          fontSize: 24,
          color: theme.colors.white,
          fontFamily: "Poppins-Semibold",
        },
        styles.root,
      ]}
    >
      {date.format("MMMM  YYYY")}
    </Typography>
  );
};
export default React.memo(MonthHeader);
const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    width: "100%",
    position: "relative",
    minHeight: 33,
    paddingVertical: 10,
    backgroundColor: theme.colors.secondary,
    elevation: 0,
  },
});
