import { useAppContext } from "@api/context/AppContext";
import { theme } from "@assets/theme";
import Button from "@components/common/Button";
import CommonLayout from "@components/common/CommonLayout";
import Typography from "@components/common/Typography";
import { AntDesign } from "@expo/vector-icons";
import {
  Days,
  excludeDate,
  generateSlots,
  generateSlotsExistingAvailabilities,
  getTime,
  slots,
  updateValue,
  validateSlots,
} from "@screens/dashboard/availability/functions";
import Slot from "@screens/dashboard/availability/Slot";
import { FlashList } from "@shopify/flash-list";
import { delay } from "lodash";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
// import { excludeDate, validateSlots, updateValue, generateSlots } from './functions';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type OffsetType = {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
};
export const SQUARE_SIZE = Dimensions.get("window").width / 5;

const BottomHalfModal = forwardRef(
  (props: { open: boolean; progress: number }, ref) => {
    const scaleY = useRef(new Animated.Value(0)).current;
    const height = 15 * theme.vh;
    const [open, setOpen] = useState(false);

    // const panResponder = useRef(
    //   PanResponder.create({
    //     onMoveShouldSetPanResponder: () => true,
    //     onPanResponderMove: (
    //       _: GestureResponderEvent,
    //       { moveY }: PanResponderGestureState
    //     ) => {
    //       if (moveY <= height) {
    //         scaleY.setValue(moveY);
    //       }
    //     },
    //     onPanResponderRelease: () => {
    //       if (parseInt(JSON.stringify(scaleY)) > 0.5 * height) {
    //         scaleY.setValue(height);
    //         setOpen(true);
    //       } else {
    //         setOpen(false);
    //         scaleY.setValue(0);
    //         return;
    //       }
    //     },
    //   })
    // ).current;

    useEffect(() => {
      toggleMenu();
    }, [props.progress]);

    useImperativeHandle(ref, () => {
      return {
        toggleMenu,
      };
    });
    useEffect(() => {
      const id = setTimeout(() => {
        if (open) {
          toggleMenu();
        }
      }, 2000);
      return () => {
        clearTimeout(id);
      };
    }, [open]);
    const toggleMenu = () => {
      if (open) {
        setOpen(false);
        scaleY.setValue(0);
        return;
      }
      setOpen(true);
      scaleY.setValue(height);
    };

    return (
      <Animated.View
        style={[
          styles.modal,
          {
            height: scaleY,
          },
        ]}
      >
        <View
          style={[
            {
              flex: 1,
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 4,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => toggleMenu()}
            style={[{ marginLeft: "auto" }]}
          >
            <AntDesign name="close" size={14} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <View
          style={[{ flex: 5, justifyContent: "center", alignItems: "center" }]}
        >
          {props.progress !== 0 ? (
            <Typography
              style={[
                {
                  color: theme.colors.primary,
                },
              ]}
            >
              Once you click confirm, your availabilities will be submitted and
              can not be modified for [Month]
            </Typography>
          ) : (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                style={[
                  {
                    color: theme.colors.primary,
                    marginRight: 5,
                  },
                ]}
              >
                You need to give
              </Typography>
              <Typography
                style={[
                  {
                    color: theme.colors.primary,
                    marginRight: 5,
                    fontFamily: "Poppins-Bold",
                  },
                ]}
              >
                12 Slots
              </Typography>
              <Typography
                style={[
                  {
                    color: theme.colors.primary,
                    marginRight: 5,
                    fontFamily: "Poppins-Bold",
                  },
                ]}
              >
                in
              </Typography>
              <Typography
                style={[
                  {
                    color: theme.colors.primary,
                    fontFamily: "Poppins-Bold",
                  },
                ]}
              >
                3 different days
              </Typography>
            </View>
          )}
        </View>
      </Animated.View>
    );
  }
);

export default function Availability() {
  const {
    user: { availabilities },
    setLoading,
    refresh,
    loading,
    updateAvailability,
  } = useAppContext();

  const slots =
    availabilities?.user_data != null
      ? generateSlotsExistingAvailabilities(availabilities?.user_data)
      : generateSlots();

  const [progress, setProgress] = React.useState(
    availabilities?.user_data != null ? 2 : 0
  );
  const selectedSlots = useRef<Array<any>>(slots);
  // const [openModal, setOpenModal] = React.useState<any>(true);
  const [isValidSelection, setIsValidSelection] = useState(true);
  const [slotsState, setSlotsState] = useState(slots);

  const ref = useRef<any>(null);

  const days = React.useMemo(
    () =>
      Days.map((day) => (
        <Typography style={styles.dayText} key={day}>
          {day}
        </Typography>
      )),
    []
  );

  const periods = React.useMemo(
    () =>
      getTime().map((period) => (
        <Typography style={styles.periodText} key={period}>
          {period}
        </Typography>
      )),
    []
  );

  const handleSelected = ({ id, isSelected }: any) => {
    const vl = updateValue([...selectedSlots.current], id, isSelected);
    setIsValidSelection(validateSlots(vl));
    selectedSlots.current = vl;
  };

  const checkAvailabilities = async () => {
    setLoading(true);
    let sub = selectedSlots.current;
    const payload = sub.map((a) => {
      return {
        status: Number(!a.isSelected),
        id: `disp ${a.value.time} ${Days.indexOf(a.value.day) + 1}`,
      };
    });
    // console.log("sub", payload);
    const data_availability = {
      data_range: availabilities?.date.join("/"),
      array: JSON.stringify([{ Stringa: payload }]),
    };
    const data = await updateAvailability(data_availability);
    setLoading(false);

    if (data) {
      setSlotsState(generateSlotsExistingAvailabilities(data));
      // console.log("generateSlots", data);
      // console.log("generateSlots", data);

      setProgress(2);
      refresh();
    }
  };

  return (
    <CommonLayout
      heading="Availability"
      subHeading="Select only the slot in which you are"
      // affix={() => <Slot id={"0"} value={false} />}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView style={{ flex: 1, paddingBottom: 10 }}>
          <View
            style={[
              {
                flexDirection: "row",
                height: "100%",
              },
              styles.root,
            ]}
          >
            <View style={styles.periodContainer}>{periods}</View>

            <View style={[{ flexDirection: "column", flex: 1 }]}>
              <View style={styles.dayContainer}>{days}</View>
              <View style={[styles.grid]}>
                <FlashList
                  numColumns={7}
                  data={slotsState}
                  estimatedItemSize={31}
                  renderItem={({ item }) => (
                    <Slot
                      id={item.id}
                      // key={slot.id + "k"}
                      value={item.value}
                      isSelected={!item.isSelected}
                      exclude={excludeDate(item.value)}
                      disabled={excludeDate(item.value) || progress !== 0}
                      setIsSelected={handleSelected}
                      progress={progress}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {progress === 0 && (
        <Button
          mode="contained"
          style={{ marginTop: 20, opacity: isValidSelection ? 1 : 0.5 }}
          buttonColor={theme.colors.button}
          contentStyle={{ flexDirection: "row-reverse" }}
          icon="chevron-right"
          onPress={() =>
            isValidSelection
              ? setProgress((r) => r + 1)
              : ref.current?.toggleMenu()
          }
        >
          next
        </Button>
      )}
      {progress === 1 && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 20,
            height: 59,
          }}
        >
          <Button
            mode="contained"
            style={{ flex: 1 }}
            buttonColor={theme.colors.button}
            contentStyle={{ flexDirection: "row-reverse" }}
            onPress={() => setProgress(0)}
          >
            Edit
          </Button>
          <Button
            mode="contained"
            disabled={loading}
            style={{ marginLeft: 10, flex: 1 }}
            buttonColor={theme.colors.green}
            textColor={theme.colors.onButtonGreen}
            contentStyle={{ flexDirection: "row-reverse" }}
            onPress={() => checkAvailabilities()}
          >
            confirm
          </Button>
        </View>
      )}
      <BottomHalfModal ref={ref} progress={progress} />
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  listWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  squareStyle: {
    backgroundColor: "orangered",
    height: SQUARE_SIZE,
    width: SQUARE_SIZE,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  root: {
    flex: 1,
    width: "100%",
    paddingBottom: theme.vh * 5,
    // backgroundColor: theme.colors.lightPrimary,
  },

  periodContainer: {
    // backgroundColor: theme.colors.button,
    height: "100%",
    flexDirection: "column",
    marginTop: 22,
    marginRight: 10,
  },
  periodText: {
    color: theme.colors.white,
    flex: 1,
    textAlign: "center",
    // marginBottom: "auto",
    marginBottom: 5,
    marginRight: 5,
    height: theme.vh * 4,
    maxHeight: 26,
    minHeight: 23,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dayContainer: {
    height: 30,
    flexDirection: "row",
    width: "100%",
    // backgroundColor: theme.colors.button,
  },
  dayText: {
    color: theme.colors.white,
    flex: 1,
    textAlign: "center",
  },

  grid: {
    flexDirection: "column",
    width: "100%",
    // backgroundColor: theme.colors.red,
    height: "100%",
  },
  slot: {
    flex: 1,
    width: "100%",
    marginBottom: 5,
    marginRight: 5,
    height: theme.vh * 4,
    maxHeight: 26,
    minHeight: 23,
    borderRadius: 5,
  },
  modal: {
    backgroundColor: theme.colors.white,
    position: "absolute",
    bottom: -35,
    width: 100 * theme.vw,
    left: -15,
    elevation: 10,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
});
