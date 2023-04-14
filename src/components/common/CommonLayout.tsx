import React from "react";
import { ScrollView, View } from "react-native";

import Typography from "./Typography";
import { theme } from "../../../assets/theme";
import tw from "twrnc";

type Props = {
  affix?: React.ReactNode;
  heading?: string;
  subHeading?: string;
  children?: React.ReactNode;
};
export default function CommonLayout({
  affix,
  subHeading,
  heading,
  children,
}: Props) {
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View
        style={[
          { flex: 1, flexDirection: "column" },
          tw`mb-[${8 * theme.vh}] max-h-[${2.4 * theme.vh}]`,
        ]}
      >
        <Typography
          style={{
            fontFamily: "Poppins-Semibold",
            fontSize: theme.vw < 300 ? 18 : 24,
            color: theme.colors.white,
          }}
        >
          {heading}
        </Typography>
        <View style={{ flexDirection: "row" }}>
          <Typography
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: theme.vw < 300 ? 12 : 16,
              color: theme.colors.white,
            }}
          >
            {subHeading}
          </Typography>
          {affix}
        </View>
      </View>
      <View style={{ flex: 10 }}>{children}</View>
    </View>
  );
}
