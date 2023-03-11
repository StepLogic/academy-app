import { createMyNavigator } from "@components/Navigator";
import Typography from "@components/common/Typography";
import { theme } from "assets/theme";
import moment, { Moment } from "moment-timezone";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { useNavigation } from "@react-navigation/core";
type Props = {
  date: Moment;
  events?: any;
};
const DateSlot = ({ date, events }: Props) => {
  const navigate = useNavigation();
  const EventSlot = ({ event }: Props) => {
    const startDate = moment(event.data + " " + event.ora);

    const endTime =
      event.ora_fine == null
        ? moment(event.data + " " + event.ora)
            .add({ hours: 1 })
            .clone()
        : moment(event.data + " " + event.ora_fine);

    const isPast = moment().isAfter(endTime, "minutes");
    return (
      <TouchableOpacity
        style={[
          [styles.event],
          {
            backgroundColor: isPast
              ? theme.colors.grey
              : theme.colors.lightPrimary,
          },
        ]}
        onPress={() => {
          navigate.navigate("AgendaInner", { isPast, event });
        }}
      >
        <FontAwesome
          name="circle-o"
          size={16}
          style={{
            // backgroundColor: theme.colors.red,
            marginBottom: 4,
            marginRight: 4 * theme.vw,
            flex: 1,
          }}
          color={theme.colors.button}
        />
        <View style={tw`flex-14 flex-row items-center`}>
          <Typography
            style={[
              {
                textDecorationLine: isPast ? "line-through" : "none",
                fontFamily: "Poppins-Regular",
                paddingRight: 5,
                flex: 10,
                // backgroundColor: theme.colors.white,
              },
            ]}
          >
            {startDate.format("HH:mm")} - {endTime.format("HH:mm")}
          </Typography>
          <Typography
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[
              {
                textDecorationLine: isPast ? "line-through" : "none",
                flex: 12,
                // backgroundColor: theme.colors.white,
                fontFamily: "Poppins-Semibold",
              },
            ]}
          >
            {event.nome_visualizzato == null || event.nome_visualizzato == ""
              ? event.titolo
              : event.nome_visualizzato}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };
  const NoEventSlot = () => (
    <View style={styles.noEvent}>
      <Typography
        style={{
          textAlign: "center",
          color: theme.colors.white,
          fontFamily: "Poppins-Regular",
        }}
      >
        No event planned
      </Typography>
    </View>
  );
  return (
    <View style={[styles.root]}>
      <View
        style={[
          tw`flex-col flex-2 items-center justify-center mr-[${
            theme.vw * 5
          }]  mt-[5px] h-[40px] `,
          // { backgroundColor: theme.colors.button },
        ]}
      >
        <Typography
          style={[
            {
              textTransform: "uppercase",
              fontSize: 13,
              textAlign: "center",
              minWidth: 24,
              color: moment().isSame(date, "day")
                ? theme.colors.button
                : theme.colors.white,
            },
          ]}
        >
          {date.format("ddd")}
        </Typography>
        <Typography
          style={{
            fontSize: 16,
            color: moment().isSame(date, "day")
              ? theme.colors.button
              : theme.colors.white,
            fontFamily: "Poppins-Bold",
            // marginTop,
          }}
        >
          {date.format("DD")}
        </Typography>
      </View>
      <View style={[tw`flex-col pt-[5px] flex-12`, styles.eventsContainer]}>
        {events && events.length === 0 && <NoEventSlot />}
        {events.map((_, idx) => (
          <EventSlot key={"event_" + _.ora + idx} date={date} event={_} />
        ))}
      </View>
    </View>
  );
};

export default React.memo(DateSlot);
const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    width: "100%",
    position: "relative",
    minHeight: 33,
  },
  noEvent: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    borderColor: theme.colors.white,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 3,
    height: 43,
    marginBottom: 5,
    paddingLeft: 5 * theme.vw,
  },
  event: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: theme.colors.white,
    borderRadius: 3,
    height: 43,
    marginBottom: 5,
    justifyContent: "flex-start",
    paddingLeft: 5 * theme.vw,
    paddingRight: 5 * theme.vw,
  },
  eventsContainer: {
    flex: 10,
    marginLeft: -8,
  },
});
