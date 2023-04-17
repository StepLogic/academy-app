import Typography from "@components/common/Typography";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { theme } from "assets/theme";
import moment from "moment";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Button } from "react-native-paper";
import { useMediaQuery } from "react-responsive";
import tw from "twrnc";

export const BASE_URL = "https://api.edusogno.com/api/admin/v1";
const HourButton = () => {
  const [tap, setTap] = useState(false);

  return (
    <View style={tw`flex-row items-center`}>
      <Button
        style={{
          borderColor: theme.colors.primary,
          borderRadius: 4,
          width: tap ? "30%" : "100%",
          backgroundColor: tap ? theme.colors.primary : theme.colors.white,
        }}
        contentStyle={{}}
        onPress={() => setTap((r) => !r)}
        mode={tap ? "contained" : "outlined"}
      >
        <Typography
          style={{
            color: tap ? theme.colors.white : theme.colors.primary,
            fontFamily: "Poppins-Medium",
            fontSize: 14,
          }}
        >
          09:00
        </Typography>
      </Button>
      {tap && (
        <Button
          style={{
            borderRadius: 4,
            width: "70%",
            marginLeft: 10,
            borderColor: theme.colors.green,
            elevation: 2,
          }}
          contentStyle={{}}
          onPress={() => setTap(true)}
          mode="outlined"
          buttonColor={theme.colors.green}
          textColor={theme.colors.buttonGreen}
        >
          <Typography
            style={{
              color: theme.colors.buttonGreen,
              fontFamily: "Poppins-Bold",
              fontSize: 14,
            }}
          >
            CONFERMA
          </Typography>
        </Button>
      )}
    </View>
  );
};
const ScheduleMeeting = ({ meetings, showError }: any) => {
  const [selectedDate, setSelectedDate] = React.useState(moment());
  const [currentMonth, setCurrentMonth] = React.useState(moment().month());
  const month = moment().month();
  const [steps, setSteps] = useState(0);
  const [hours, setHours] = React.useState(null);
  const isMediumHeight = useMediaQuery({ maxHeight: 600 });

  const renderItem = React.useCallback(({ item }: any) => <HourButton />, []);
  return (
    <>
      <View
        style={[
          tw`flex-row justify-center items-center flex-1`,
          {
            // backgroundColor: theme.colors.buttonGreen,
          },
        ]}
      >
        {steps === 0 ? (
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(moment(day.dateString, "YYYY-MM-DD"));
              setSteps(1);
            }}
            minDate={moment().format("YYYY-MM-DD")}
            style={{
              //   height: theme.vh * 8,
              width: theme.vw * 80,
              borderTopEndRadius: 100,
              borderTopStartRadius: 100,
              //   paddingBottom: theme.vh * 6,
            }}
            textDayStyle={{
              marginTop: 0,
            }}
            //   markedDates={markedDates()}
            onMonthChange={(d) => {
              //   the d starts indexing at one but monet starts at 0
              setCurrentMonth(d.month - 1);
            }}
            disableArrowLeft={currentMonth == month}
            disableArrowRight={currentMonth >= month + 1}
            renderArrow={(direction) =>
              direction == "left" ? (
                <Entypo
                  name="chevron-left"
                  size={!isMediumHeight ? 28 : 16}
                  color={
                    currentMonth === month ? "#00000060" : theme.colors.primary
                  }
                />
              ) : (
                <Entypo
                  name="chevron-right"
                  size={!isMediumHeight ? 28 : 16}
                  color={
                    currentMonth >= month + 1
                      ? "#00000060"
                      : theme.colors.primary
                  }
                />
              )
            }
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: theme.colors.primary,
              textSectionTitleDisabledColor: "#d9e1e8",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              dayTextColor: theme.colors.secondary,
              textDisabledColor: "#00000060",
              selectedDotColor: "#ffffff",
              disabledArrowColor: "#d9e1e8",
              todayDotColor: theme.colors.secondary,
              todayTextColor: theme.colors.secondary,
              monthTextColor: theme.colors.primary,
              indicatorColor: "blue",
              textDayFontFamily: "Poppins-Regular",
              textMonthFontFamily: "Poppins-Semibold",
              textDayHeaderFontFamily: "Poppins-Regular",
              textDayFontSize: !isMediumHeight ? 13 : 11,
              textDayStyle: {
                marginTop: 0,
                width: !isMediumHeight ? 32 : 22,
                height: !isMediumHeight ? 32 : 22,
              },
              textMonthFontSize: !isMediumHeight ? 28 : 18,
              weekVerticalMargin: 2,
              textDayHeaderFontSize: !isMediumHeight ? 13 : 11,
              "stylesheet.calendar.header": {
                week: {
                  marginTop: theme.vh * 2,
                  marginBottom: theme.vh * 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
                dayHeader: {
                  width: 36,
                  textAlign: "center",
                  color: theme.colors.primary,
                  textTransform: "uppercase",
                },
                header: {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingLeft: 10,
                  paddingRight: 10,
                  alignItems: "center",
                },
              },
              // "stylesheet.calendar.day.basic": {
              //   base: {
              //     width: theme.vw > 300 ? 32 : 22,
              //     height: theme.vw > 300 ? 32 : 22,
              //     alignItems: "center",
              //     backgroundColor: theme.colors.primary,
              //   },
              // },
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              // height: theme.vh * 58,
              //   backgroundColor: theme.colors.buttonGreen,
            }}
          >
            <View
              style={tw`flex flex-row items-center justify-center mb-${
                !isMediumHeight ? "8" : "4"
              }  `}
            >
              <TouchableOpacity onPress={() => setSteps(0)}>
                <AntDesign
                  name="arrowleft"
                  size={!isMediumHeight ? 24 : 16}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <Typography
                style={{
                  color: theme.colors.primary,
                  fontSize: !isMediumHeight ? 24 : 18,
                  fontFamily: "Poppins-Semibold",
                  lineHeight: 32,
                  marginLeft: 10,
                }}
              >
                {selectedDate.format("dddd DD MMMM")}
              </Typography>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: theme.colors.lightPrimary,
                paddingHorizontal: theme.vw * 5,
                paddingVertical: theme.vh * 6,
              }}
            >
              <FlashList
                // contentContainerStyle={{
                //   flex: 1,
                // }}
                data={Array.from({ length: 10 })}
                renderItem={renderItem}
                estimatedItemSize={37}
                ItemSeparatorComponent={() => (
                  <View style={[{ marginVertical: 10 }]} />
                )}
              />
            </View>
          </View>
        )}
      </View>
    </>
  );
};
export default ScheduleMeeting;
