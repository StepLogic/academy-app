// import { useUIContext } from "@contexts/UIContext";
import Button from "@components/common/Button";
import Select from "@components/common/Select";
import TextField from "@components/common/TextField";
import { theme } from "assets/theme";
import * as React from "react";
import {
  Animated,
  FlatList,
  LayoutChangeEvent,
  ScrollResponderEvent,
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
import { getDateBetween, getDateTruncated } from "./calendar";
import { useState, useEffect, useRef } from "react";
import Calendar from "./common/Calendar";
import MonthHeader from "./common/MonthHeader";
import { Moment } from "moment";
import * as _ from "lodash";
import { filter } from "lodash";
import { useAppContext } from "@api/context/AppContext";
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const AgendaLanding = () => {
  const {
    user: { events },
  } = useAppContext();
  const dates = React.useMemo(() => getDateTruncated(moment()), []);
  const prevDates = React.useMemo(
    () => getDateTruncated(moment().clone().subtract(1, "month")),
    []
  );
  const nextDates = React.useMemo(
    () => getDateTruncated(moment().clone().add(1, "month")),
    []
  );

  const initialIndex = prevDates.data.length + 3 + moment().date();

  const headerOffset = useRef([]);

  const [openCalendar, setOpenCalendar] = useState(false);
  // const [activeIndex, setActiveIndex] = useState(1);
  const [list, setList] = useState([prevDates, dates, nextDates]);

  const [activeMonth, setActiveMonth] = useState<Moment>(moment());
  const [isTodayViewable, setIsTodayViewable] = useState<boolean>(true);

  const scrollRef = useRef<SectionList>(null);

  const handleOnViewableChange = (info: Object) => {
    const monthDetect = _.throttle(() => {
      if (info && info.viewableItems) {
        const titles = info.viewableItems.map((r) => r.section.title);
        if (moment(titles[0], "YYYY-MM-DD").isSame(activeMonth, "month"))
          return;
        setActiveMonth(moment(titles[0], "YYYY-MM-DD"));
      }
    }, 1000);
    const dayDetect = () => {
      const isTodayNotInView = info.viewableItems
        .map((r) =>
          r.section.data.map((l) =>
            moment(l, "YYYY-MM-DD").isSame(moment(), "day")
          )
        )
        .flat()
        .every((r) => r === false);
      // isTodayNotInView !== true && console.log("is", isTodayNotInView);
      setIsTodayViewable(!isTodayNotInView);
    };
    if (info && info.viewableItems) {
      monthDetect();
      dayDetect();
    }
  };

  const handleScrollToday = React.useCallback(() => {
    scrollRef.current?.scrollToLocation({
      sectionIndex: 1,
      itemIndex: moment().date(),
      animated: false,
    });
  }, []);
  const renderSectionHeader = React.useCallback(
    ({ section: { title, index } }: any) => <MonthHeader date={title} />,
    []
  );
  const renderItem = React.useCallback(
    ({ item }: any) => (
      <DateSlot
        date={item}
        events={filter(events, (event) => {
          return moment(event.data).isSame(item, "day");
        })}
      />
    ),
    []
  );
  const getLayout = React.useCallback((data, index) => {
    // const d = Object.values(data)
    //   .flat()
    //   .map((r) => r.data)
    //   .flat();
    // const child = filter(events, (event) => {
    //   return moment(event.data).isSame(d[index], "day");
    // }).length;
    // const l = child > 0 ? child : 1;
    const LENGTH = 6 + 1 * 70;
    const OFFSET = 20 + index * LENGTH;
    // console.log("child", child);

    return {
      length: LENGTH,
      offset: OFFSET,
      index,
    };
  }, []);
  const keyExtractor = React.useCallback(
    (item: any, index: number) => "data" + index,
    []
  );
  // useEffect(() => {
  //   const ids = setTimeout(() => {
  //     handleScrollToday();
  //   }, 2000);
  //   return () => {
  //     clearInterval(ids);
  //   };
  // }, []);

  return (
    <View style={styles.root}>
      <Calendar
        setOpen={setOpenCalendar}
        month={activeMonth}
        open={openCalendar}
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
          <TouchableHighlight
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
          </TouchableHighlight>

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
        <AnimatedSectionList
          // initialScrollIndex={initialIndex}
          ref={scrollRef}
          onScroll={handleOnViewableChange}
          sections={list}
          keyExtractor={keyExtractor}
          stickySectionHeadersEnabled={true}
          onScrollToIndexFailed={(r) => console.log("failed", r)}
          renderItem={renderItem}
          SectionSeparatorComponent={() => (
            <View style={[{ marginVertical: 3 }]} />
          )}
          ItemSeparatorComponent={() => (
            <View style={[{ marginVertical: 6 }]} />
          )}
          getItemLayout={getLayout}
          renderSectionHeader={renderSectionHeader}
          onViewableItemsChanged={handleOnViewableChange}
          onLayout={handleScrollToday}
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
