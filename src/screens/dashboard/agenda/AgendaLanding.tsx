import { theme } from "assets/theme";
import * as React from "react";
import {
  Animated,
  SectionList,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import DateSlot from "./common/DateSlots";
import Typography from "@components/common/Typography";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";
import { getDateTruncatedFlashList } from "./calendar";
import { useState, useRef } from "react";
import Calendar from "./common/Calendar";
import MonthHeader from "./common/MonthHeader";
import { Moment } from "moment";
import * as _ from "lodash";
import { filter } from "lodash";
import { useAppContext } from "@api/context/AppContext";
import { FlashList } from "@shopify/flash-list";
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const AgendaLanding = () => {
  const {
    user: { events },
  } = useAppContext();
  const dates = React.useMemo(() => getDateTruncatedFlashList(moment()), []);
  const prevDates = React.useMemo(
    () => getDateTruncatedFlashList(moment().clone().subtract(1, "month")),
    []
  );
  const nextDates = React.useMemo(
    () => getDateTruncatedFlashList(moment().clone().add(1, "month")),
    []
  );

  const initialIndex = prevDates.length + moment().date() - 2;

  // console.log("starting.flashlist", initialIndex);

  const [openCalendar, setOpenCalendar] = useState(false);
  // const [activeIndex, setActiveIndex] = useState(1);
  const [list, setList] = useState([...prevDates, ...dates, ...nextDates]);

  const [activeMonth, setActiveMonth] = useState<Moment>(moment());
  const [isTodayViewable, setIsTodayViewable] = useState<boolean>(true);

  const scrollRef = useRef<SectionList>(null);

  const handleOnViewableChange = (info: Object) => {
    const monthDetect = _.throttle(() => {
      if (info && info.viewableItems) {
        const titles = info.viewableItems.map((r) => r.item.day);
        if (moment(titles[0], "DD-MM-YYYY").isSame(activeMonth, "month"))
          return;
        setActiveMonth(moment(titles[0], "DD-MM-YYYY"));
      }
    }, 1000);
    const dayDetect = () => {
      const isTodayNotInView = info.viewableItems
        .filter((r) => typeof r !== "string")
        .map((r) => moment(r.item.day, "DD-MM-YYYY").isSame(moment(), "day"))
        .every((r) => r === false);
      setIsTodayViewable(!isTodayNotInView);
    };
    if (info && info.viewableItems) {
      monthDetect();
      dayDetect();
    }
  };

  const handleScrollToday = React.useCallback(() => {
    scrollRef.current?.scrollToIndex({
      index: initialIndex,
      animated: false,
    });
  }, []);

  const renderItem = React.useCallback(
    ({ item }: any) =>
      typeof item === "string" ? (
        <MonthHeader date={moment(item, "DD-MM-YYYY")} />
      ) : (
        <DateSlot
          date={moment(item.day, "DD-MM-YYYY")}
          events={filter(events, (event) => {
            return moment(event.data).isSame(
              moment(item.day, "DD-MM-YYYY"),
              "day"
            );
          })}
        />
      ),
    []
  );

  const keyExtractor = React.useCallback(
    (item: any, index: number) => "data" + index,
    []
  );

  const stickyHeaderIndices = list
    .map((item, index) => {
      if (typeof item === "string") {
        return index;
      } else {
        return null;
      }
    })
    .filter((item) => item !== null) as number[];
  return (
    <View style={styles.root}>
      <Calendar
        setOpen={setOpenCalendar}
        month={activeMonth}
        open={openCalendar}
        events={events}
      />
      <View style={tw`w-full flex-col  flex-1`}>
        <View
          style={[
            {
              position: "absolute",
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
              right: 0,
              top: 13,
              elevation: 4,
              zIndex: 400,
            },
          ]}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              maxWidth: 25,
              marginBottom: 4,
            }}
            onPress={() => setOpenCalendar((r) => !r)}
          >
            {openCalendar ? (
              <Entypo name="chevron-thin-up" size={24} color="white" />
            ) : (
              <Entypo name="chevron-thin-down" size={24} color="white" />
            )}
          </TouchableOpacity>

          <TouchableHighlight
            style={[
              styles.todayButton,
              {
                flex: 1,
                marginLeft: 20,
                backgroundColor: isTodayViewable
                  ? theme.colors.button
                  : theme.colors.lightPrimary,
              },
            ]}
            onPress={() => {
              handleScrollToday();
            }}
          >
            <Typography
              variant="labelLarge"
              style={{
                color: isTodayViewable
                  ? theme.colors.white
                  : theme.colors.secondary,
              }}
            >
              Today
            </Typography>
          </TouchableHighlight>
        </View>

        <FlashList
          stickyHeaderIndices={stickyHeaderIndices}
          data={list}
          renderItem={renderItem}
          onViewableItemsChanged={handleOnViewableChange}
          keyExtractor={keyExtractor}
          ref={scrollRef}
          estimatedItemSize={100}
          SectionSeparatorComponent={() => (
            <View style={[{ marginVertical: 3 }]} />
          )}
          ItemSeparatorComponent={() => (
            <View style={[{ marginVertical: 6 }]} />
          )}
          getItemType={(item) => {
            return typeof item === "string" ? "sectionHeader" : "row";
          }}
          initialScrollIndex={initialIndex - 4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    // position: "relative",
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: theme.colors.white,
  },
  todayButton: {
    maxWidth: 71,
    height: 26,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
});

export default React.memo(AgendaLanding);
