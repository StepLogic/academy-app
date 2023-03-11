import Header from "@components/headers/Header";
import {
  createNavigatorFactory,
  TabRouter,
  useNavigationBuilder,
} from "@react-navigation/native";
import { theme } from "assets/theme";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useLayoutLogic } from "@api/context/LayoutContext";

function TopNavigator({
  initialRouteName,
  children,
  screenOptions,
  tabBarStyle,
  contentStyle,
}: any) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder(TabRouter, {
      children,
      screenOptions,
      initialRouteName,
    });
  const { bgColor } = useLayoutLogic();

  return (
    <NavigationContent>
      <View
        style={[
          {
            flex: 1,
            elevation: 1,

            backgroundColor: bgColor,
          },
          contentStyle,
        ]}
      >
        <Header state={state} />
        <View style={[{ flex: 1, elevation: 1 }, contentStyle]}>
          {state.routes.map((route, i) => {
            return (
              <View
                key={route.key}
                style={[
                  StyleSheet.absoluteFill,
                  { display: i === state.index ? "flex" : "none" },
                  {
                    paddingHorizontal: 4 * theme.vw,
                    paddingVertical: 4 * theme.vh,
                  },
                ]}
              >
                {descriptors[route.key].render()}
              </View>
            );
          })}
        </View>
      </View>
    </NavigationContent>
  );
}
export const createMyNavigator = createNavigatorFactory(TopNavigator);
