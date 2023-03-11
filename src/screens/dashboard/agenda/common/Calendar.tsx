import { useMemo, useState, useEffect, useRef } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { getDate, Days, getDateTruncated } from "../calendar";
import moment, { months } from "moment";
import Typography from "@components/common/Typography";
import { theme } from "@assets/theme";
import tw from "twrnc";
import React from "react";
import { Moment } from "moment";
import { filter } from "lodash";

const Calendar = ({
  open,
  month,
  setOpen,
  events,
}: {
  events: any;
  open: boolean;
  month: Moment;
  setOpen: Function;
}) => {
  const dates = useMemo(
    () => getDate(moment(month.format("MM"), "MM")),
    [month]
  );

  return (
    <Modal animationType="none" visible={open} transparent>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => setOpen(false)}>
        <View
          style={{
            maxHeight: 204,
            height: 30 * theme.vh,
            width: "100%",
            backgroundColor: theme.colors.secondary,
            position: "absolute",
            top: 140,
          }}
        >
          <View style={tw`flex-row items-center`}>
            {Days.map((day, index) => (
              <Typography
                style={{
                  flex: 1,
                  color: theme.colors.white,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
                key={"mini-calender-days-" + index}
              >
                {day.slice(0, 3)}
              </Typography>
            ))}
          </View>
          <View style={tw`w-full flex-col flex-1 mt-2`}>
            {dates.map((week, wIdx) => (
              <View
                key={"mini-calendar-week-" + wIdx}
                style={tw`flex-row mb-1`}
              >
                {week.map((day, dIdx) => {
                  let type = "now";
                  const m = moment(day, "DD-MM-YYYY");

                  if (m.isBefore(month, "month")) {
                    type = "past";
                  }
                  if (m.isAfter(month, "month")) type = "future";
                  const dots = filter(events, (event) => {
                    return moment(event.data).isSame(
                      moment(m, "DD-MM-YYYY"),
                      "day"
                    );
                  }).length;
                  return (
                    <View
                      key={"mini-calender-date-" + dIdx}
                      style={[tw`flex-col items-center flex-1 items-center`]}
                    >
                      {open && (
                        <View style={tw`flex-row items-center`}>
                          {Array.from({ length: dots })
                            .fill(0)
                            .map((r) => (
                              <View
                                key={"dot" + "_" + m.format("DD-MM-YYY")}
                                style={[
                                  styles.dot,
                                  {
                                    backgroundColor:
                                      type === "now"
                                        ? theme.colors.white
                                        : theme.colors.fadedWhite,
                                  },
                                ]}
                              />
                            ))}
                        </View>
                      )}
                      <Typography
                        style={[
                          {
                            color: m.isSame(moment(), "day")
                              ? theme.colors.red
                              : type === "now"
                              ? theme.colors.white
                              : theme.colors.fadedWhite,
                          },
                        ]}
                      >
                        {m.date()}
                      </Typography>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
export default Calendar;
const styles = StyleSheet.create({
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
