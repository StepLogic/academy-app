import Typography from "@components/common/Typography";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import Images from "@res/images";
import { theme } from "assets/theme";
import React, { useRef } from "react";
import { useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
  Linking,
  PanResponder,
  PanResponderGestureState,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

import {
  CaAgenda,
  CaAvailability,
  CaExercises,
  CaInvoices,
  CaMaterial,
  CaPersonalInformation,
} from "../common/Icons";
import { useLayoutLogic } from "@api/context/LayoutContext";
import { useAppContext } from "@api/context/AppContext";

interface BottomDrawerProps {
  children?: React.ReactNode;
  state: any;
}

const { height } = Dimensions.get("window");

const Header: React.FunctionComponent<BottomDrawerProps> = ({
  children,
  state,
}) => {
  //Context
  const { burgerButton } = useLayoutLogic();
  const { handleLogout } = useAppContext();
  const routes = useMemo(() => state.routes, [state]);
  const navigate = useNavigation();
  const isActive = React.useCallback(
    (name: string) => {
      const navIdx = state.index;
      return routes[navIdx].name === name;
    },
    [state]
  );
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleY = useRef(new Animated.Value(80)).current;

  const [open, setOpen] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (
        _: GestureResponderEvent,
        { moveY }: PanResponderGestureState
      ) => {
        if (moveY <= height) {
          scaleY.setValue(moveY);
        }
      },
      onPanResponderRelease: () => {
        if (parseInt(JSON.stringify(scaleY)) > 0.5 * height) {
          scaleY.setValue(height);
          setOpen(true);
        } else {
          setOpen(false);
          scaleY.setValue(80);
          return;
        }
      },
    })
  ).current;
  const toggleMenu = () => {
    if (open) {
      setOpen(false);
      scaleY.setValue(80);
      return;
    }
    setOpen(true);
    scaleY.setValue(height);
  };

  const goTo = (path: string) => {
    navigate.navigate(path);
    toggleMenu();
  };

  const Link = ({ Icon, path, label }: any) => (
    <TouchableOpacity
      style={[
        styles.link,
        {
          backgroundColor: isActive(path)
            ? theme.colors.lightPrimary
            : theme.colors.white,
        },
      ]}
      onPress={() => {
        goTo(path);
      }}
    >
      <Icon
        style={[
          styles.svg,
          {
            color: isActive(path)
              ? theme.colors.button
              : theme.colors.secondary,
          },
        ]}
      />
      <Typography
        style={[
          styles.linkText,
          {
            color: isActive(path)
              ? theme.colors.button
              : theme.colors.secondary,
          },
        ]}
      >
        {label}
      </Typography>
      {isActive(path) && (
        <Entypo
          name="chevron-small-right"
          size={24}
          color={theme.colors.button}
        />
      )}
    </TouchableOpacity>
  );
  return (
    <Animated.View
      style={[
        {
          backgroundColor: theme.colors.white,
          height: scaleY,
          borderBottomRightRadius: 13,
          borderBottomLeftRadius: 13,
          elevation: 10,
          zIndex: 100,
          position: "relative",
          flexDirection: "column",
        },
      ]}
      // {...panResponder.panHandlers}
    >
      <Animated.View
        style={[
          {
            backgroundColor: theme.colors.white,
            height:
              parseInt(JSON.stringify(scaleY)) > 0.5 * height ? scaleY : 0,
            position: "relative",
            flexDirection: "column",
            alignItems: "center",
            marginTop: theme.vh * 15,
          },
        ]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            height: open ? theme.vh * 80 : 0,
          }}
        >
          <ScrollView
            style={[
              {
                width: "100%",
              },
            ]}
            contentContainerStyle={{
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography style={[styles.heading]}>your path</Typography>
            <Link Icon={CaAgenda} label="Agenda" path="AgendaLanding" />
            <Link
              Icon={CaExercises}
              label="Exercises"
              path="ExercisesLanding"
            />

            <Link Icon={CaMaterial} label="Materials" path="MaterialsLanding" />

            <Typography style={[styles.heading, { marginTop: theme.vh * 2 }]}>
              your profile
            </Typography>

            <Link
              Icon={CaPersonalInformation}
              label="Personal info"
              path="PersonalInfo"
            />
            <Link Icon={CaInvoices} label="Invoices" path="InvoicesLanding" />
            <Link
              Icon={CaAvailability}
              label="Availability"
              path="Availability"
            />

            <TouchableOpacity
              style={[styles.link, { marginTop: theme.vh * 6 }]}
              onPress={async () => {
                toggleMenu();
                const supported = await Linking.canOpenURL(
                  "https://api.whatsapp.com/send?phone=3715467005"
                );
                if (supported) {
                  await Linking.openURL(
                    "https://api.whatsapp.com/send?phone=3715467005"
                  );
                } else {
                  Alert.alert(
                    `Don't know how to open this URL: ${"https://api.whatsapp.com/send?phone=3715467005"}`
                  );
                }
              }}
            >
              <FontAwesome
                name="whatsapp"
                size={24}
                color={theme.colors.secondary}
                style={[styles.svg, , { marginRight: 8 }]}
              />
              <Typography style={[styles.linkText]}>Need help?</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.link]}
              onPress={() => {
                toggleMenu();
                handleLogout();
              }}
            >
              <SimpleLineIcons
                name="logout"
                size={24}
                style={[styles.svg, { marginRight: 8 }]}
                color={theme.colors.primary}
              />

              <Typography style={[styles.linkText]}>Logout</Typography>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animated.View>
      <View
        style={[
          tw`absolute elevation-4 top-0 mb-auto
           flex-row max-h-[80px] h-full w-full items-center justify-between px-6`,
          {
            background: "transparent",
          },
        ]}
      >
        <Image
          style={{ width: 94, height: 40 }}
          resizeMode="contain"
          source={Images.logo}
        />
        {burgerButton !== null ? (
          burgerButton
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (open) {
                setOpen(false);
                scaleY.setValue(80);
                return;
              }
              setOpen(true);
              scaleY.setValue(height);
            }}
          >
            {open ? (
              <AntDesign
                name="close"
                size={24}
                color={theme.colors.secondary}
              />
            ) : (
              <Octicons
                name="three-bars"
                size={24}
                color={theme.colors.secondary}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  menuContent: {},
  heading: {
    textTransform: "uppercase",
    fontSize: 20,
    fontFamily: "Poppins-Semibold",
    color: theme.colors.button,
    marginBottom: 25,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "65%",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  linkText: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
    flex: 9,
  },
  svg: {
    width: 30,
    flex: 1,
  },
});

export default Header;
