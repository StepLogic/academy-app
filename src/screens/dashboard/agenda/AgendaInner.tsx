// import { useUIContext } from "@contexts/UIContext";
import { theme } from "@assets/theme";
import Typography from "@components/common/Typography";
import Images from "@res/images";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Linking,
  Alert,
  FlatList,
} from "react-native";
import tw from "twrnc";
import FastImage from "react-native-fast-image";
import Button from "@components/common/Button";

import { FontAwesome5 } from "@expo/vector-icons";
import { useLayoutLogic } from "@api/context/LayoutContext";
import { useNavigation, useRoute } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

import moment from "moment-timezone";
import { useAppContext } from "@api/context/AppContext";
import { delay } from "lodash";
const Link = ({ token, type = "video", label }) => {
  const navigate = useNavigation();
  return (
    <TouchableOpacity
      style={tw`flex-row items-center`}
      onPress={() => navigate.navigate("MaterialInner", { type, token })}
    >
      {type === "video" ? (
        <FontAwesome5
          name="video"
          style={[]}
          size={24}
          color={theme.colors.secondary}
        />
      ) : (
        <FontAwesome5
          name="file-pdf"
          size={24}
          style={[]}
          color={theme.colors.secondary}
        />
      )}
      <Typography
        numberOfLines={1}
        style={[
          {
            textDecorationLine: "underline",
            marginLeft: 10,
            fontSize: 20,
            fontFamily: "Poppins-Medium",
          },
        ]}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

const AgendaInner = ({ route }) => {
  //Context
  const { setBurgerButton } = useLayoutLogic();
  const { updateCheckIn, getRecording } = useAppContext();

  const navigate = useNavigation();
  useEffect(() => {
    if (
      navigate.getState().routeNames[navigate.getState().index] ===
      "AgendaInner"
    ) {
      setBurgerButton(
        <TouchableOpacity
          onPress={() => {
            navigate.goBack();
          }}
        >
          <Feather
            name="chevron-left"
            size={24}
            color={theme.colors.secondary}
          />
        </TouchableOpacity>
      );
    }
    return () => {
      setBurgerButton(null);
    };
  }, [navigate.getState().index]);
  if (route.params?.event) {
    const event = route.params.event;
    const startDate = moment
      .tz(event.data + " " + event.ora, "Europe/Rome")
      .local();
    const endTime =
      event.ora_fine == null
        ? moment
            .tz(event.data + " " + event.ora, "Europe/Rome")
            .add({ hours: 1 })
            .local()
        : moment.tz(event.data + " " + event.ora_fine, "Europe/Rome").local();
    const duration = endTime.diff(startDate, "minutes");

    const handleClick = async () => {
      const isPast = route.params?.isPast;
      if (!isPast) {
        updateCheckIn(event.id);
        const supported = await Linking.canOpenURL(event.eventLink);
        if (supported) {
          await Linking.openURL(event.eventLink);
        } else {
          Alert.alert(`Don't know how to open this URL: ${event.eventLink}`);
        }
      } else {
        if (!event.eventLink) {
          const { link } = await getRecording(event.id);
          if (link) {
            const supported = await Linking.canOpenURL(link);
            if (supported) {
              await Linking.openURL(link);
            } else {
              Alert.alert(
                `Don't know how to open this URL: ${event.eventLink}`
              );
            }
          }
        } else {
          const supported = await Linking.canOpenURL(event.eventLink);
          if (supported) {
            await Linking.openURL(event.eventLink);
          } else {
            Alert.alert(`Don't know how to open this URL: ${event.eventLink}`);
          }
        }
      }
    };

    const handleFeedback = () => {
      if (!Boolean(event?.feedback) && !route.params?.isPast) {
        delay(navigate.navigate, 10000, ("Feedback", { id: event.id }));
      }
    };

    return (
      <View style={styles.root}>
        <View style={styles.firstSection}>
          <Typography
            numberOfLines={1}
            style={[
              {
                fontSize: theme.vw < 300 ? 18 : 24,
                color: theme.colors.white,
                fontFamily: "Poppins-Semibold",
              },
              tw`mb-[${2 * theme.vh}]`,
            ]}
          >
            {event.nome_visualizzato == null || event.nome_visualizzato == ""
              ? event.titolo
              : event.nome_visualizzato}
          </Typography>
          <View style={tw`flex flex-col mb-[${3 * theme.vh}]`}>
            <Typography style={[styles.label, styles.white]}>Topic</Typography>
            <Typography style={[styles.value, styles.white]}>
              {event.titolo_argomento}
            </Typography>
          </View>
          <View style={tw`flex flex-col`}>
            <Typography style={[styles.label, styles.white]}>Date</Typography>
            <Typography style={[styles.value, styles.white]}>
              {moment(startDate).format("ddd DD/MM/YYYY")}
            </Typography>
          </View>
        </View>
        <ImageBackground
          source={Images.eventDetailsBackground}
          style={styles.secondSection}
          resizeMode="stretch"
        >
          <View style={tw`flex flex-1 flex-col h-full`}>
            <View style={tw`flex flex-row h-1/2`}>
              <View style={tw`flex flex-1 flex-col items-center`}>
                <Image
                  style={{
                    width: theme.vw < 300 ? 90 : 132,
                    height: theme.vw < 300 ? 90 : 132,
                    borderRadius: 66,
                  }}
                  source={
                    event.tutor?.profile_pic &&
                    event.tutor?.profile_pic !== null
                      ? event.tutor?.profile_pic
                      : Images.userPlaceholder
                  }
                  resizeMode={"cover"}
                />
                {/* <Image
                style={{ width: 132, height: 132, borderRadius: 66 }}
                source={{
                  uri: "https://unsplash.it/400/400?image=1",
                  headers: { Authorization: "someAuthToken" },
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              /> */}
                <Typography style={[styles.value, styles.secondary]}>
                  {event.tutors?.nome}
                </Typography>
              </View>
              <View
                style={tw`flex flex-1 flex-col items-start pt-[${
                  theme.vh * 7.5
                }]`}
              >
                <View style={tw`flex flex-col mb-[${3 * theme.vh}]`}>
                  <Typography style={[styles.label, styles.secondary]}>
                    Time
                  </Typography>
                  <Typography style={[styles.value, styles.secondary]}>
                    {moment(startDate).format("HH:mm")}-
                    {moment(startDate).add(duration, "minutes").format("HH:mm")}
                  </Typography>
                </View>
                <View style={tw`flex flex-col`}>
                  <Typography style={[styles.label, styles.secondary]}>
                    Duration
                  </Typography>
                  <Typography style={[styles.value, styles.secondary]}>
                    {`${duration} minutes`}
                  </Typography>
                </View>
              </View>
            </View>
            <Button
              textColor={theme.colors.white}
              buttonColor={
                route.params?.isPast
                  ? theme.colors.primary
                  : theme.colors.button
              }
              onPress={() => {
                handleClick();
                handleFeedback();
              }}
            >
              {route.params?.isPast ? "Watch recording" : "Join Class"}
            </Button>
            <View style={[tw`flex-col items-center`]}>
              <Typography
                style={[
                  styles.label,
                  styles.secondary,
                  { marginVertical: 2 * theme.vh },
                ]}
              >
                Material:
              </Typography>
              {event.materials &&
              event.materials !== null &&
              event.materials.length > 0 ? (
                <FlatList
                  data={event.materials}
                  renderItem={({ item }) => (
                    <Link
                      type={item.type}
                      label={item.name}
                      token={item.token}
                    />
                  )}
                />
              ) : (
                <Typography style={{ color: theme.colors.secondary }}>
                  Not available for this event
                </Typography>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
  return <></>;
};

const styles = StyleSheet.create({
  root: {
    // position: "relative",
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  firstSection: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    // backgroundColor: theme.colors.white,
    width: "100%",
  },
  secondSection: {
    width: theme.vw * 100,
    height: theme.vh * 54,
    position: "absolute",
    bottom: -theme.vh * 5,
    flex: 1,
    paddingHorizontal: 4 * theme.vw,
    zIndex: 3,
  },
  label: {
    fontSize: theme.vw < 300 ? 10 : 13,
    height: theme.vw < 300 ? 12 : 18,
    fontFamily: "Poppins-Regular",
  },
  value: {
    fontSize: theme.vw < 300 ? 16 : 20,
    height: theme.vw < 300 ? 18 : 24,
    fontFamily: "Poppins-Semibold",
  },
  white: {
    color: theme.colors.white,
  },
  secondary: {
    color: theme.colors.secondary,
  },
});

export default React.memo(AgendaInner);
