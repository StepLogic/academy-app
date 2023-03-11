// import { useUIContext } from "@contexts/UIContext";
import { theme } from "@assets/theme";
import Button from "@components/common/Button";
import CommonLayout from "@components/common/CommonLayout";
import DateField from "@components/common/DateField";
import ItemCard from "@components/common/ItemCard";
import TextField from "@components/common/TextField";
import * as React from "react";
import { Entypo } from "@expo/vector-icons";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Typography from "@components/common/Typography";
import { useAppContext } from "@api/context/AppContext";
import NoItemCard from "@components/common/NoItemCard";
import moment from "moment";

export const ExerciseType = {
  WRITING: "WRITING",
  GRAMMAR: "GRAMMAR",
  VOCABULARY: "VOCABULARY",
  READING: "READING",
  LISTENING: "LISTENING",
};

export const Status = {
  DONE: "DONE",
  TODO: "TODO",
};

const Exercises = () => {
  // const type = ExerciseType.LISTENING;
  const {
    user: { exercises },
    updateUser,
  } = useAppContext();

  const [activeTab, setActiveTab] = React.useState(0);
  const renderExerciseType = (type) => {
    switch (type) {
      case ExerciseType.WRITING:
        return "📝 Writing";
      case ExerciseType.GRAMMAR:
        return "👩‍🏫 Grammar";
      case ExerciseType.VOCABULARY:
        return "🗣️ Vocabulary";
      case ExerciseType.READING:
        return "📗 Reading";
      case ExerciseType.LISTENING:
        return "🔈 Listening";
      default:
        return "📝 Writing";
    }
  };

  const renderItem = React.useCallback(({ item, index }: any) => {
    const { name, type, data } = item;
    return (
      <ItemCard
        heading={name}
        subHeading={renderExerciseType(type.toUpperCase())}
        prompt={"To do by"}
        value={moment(data).format("ddd DD/MM/yyyy")}
      />
    );
  }, []);
  const renderItemDone = React.useCallback(({ item, index }: any) => {
    const { test_name, type, data } = item;
    return (
      <ItemCard
        heading={test_name}
        subHeading={renderExerciseType(type.toUpperCase())}
        prompt={"Done on"}
        value={moment(data).format("ddd DD/MM/yyyy")}

        // buttonAffix={
        //   <Entypo
        //     name="chevron-thin-right"
        //     size={24}
        //     color={theme.colors.primary}
        //   />
        // }
      />
    );
  }, []);

  return (
    <CommonLayout
      heading="Exercises"
      subHeading="Access with a laptop to do or see each exercise"
    >
      <View style={[styles.tabBar, tw`mb-[${theme.vh * 2}]`]}>
        <TouchableOpacity
          onPress={() => setActiveTab(0)}
          style={[
            styles.button,
            tw`bg-[${
              activeTab === 0 ? theme.colors.button : theme.colors.lightPrimary
            }]`,
          ]}
        >
          <Typography
            style={[
              styles.buttonText,
              tw`text-[${
                activeTab === 0 ? theme.colors.white : theme.colors.secondary
              }]`,
            ]}
          >
            To Do
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(1)}
          style={[
            styles.button,
            tw`bg-[${
              activeTab === 1 ? theme.colors.primary : theme.colors.lightPrimary
            }]`,
          ]}
        >
          <Typography
            style={[
              styles.buttonText,
              tw`text-[${
                activeTab === 1 ? theme.colors.white : theme.colors.secondary
              }]`,
            ]}
          >
            Done
          </Typography>
        </TouchableOpacity>
      </View>
      {activeTab === 0 ? (
        exercises?.toDo ? (
          <FlatList
            maxToRenderPerBatch={4}
            data={exercises?.toDo}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View key={"item-sep"} style={{ height: 20 }} />
            )}
          />
        ) : (
          <NoItemCard heading="No exercise is available for you" />
        )
      ) : exercises?.done ? (
        <FlatList
          maxToRenderPerBatch={4}
          data={exercises?.done}
          renderItem={renderItemDone}
          ItemSeparatorComponent={() => (
            <View key={"item-sep"} style={{ height: 20 }} />
          )}
        />
      ) : (
        <NoItemCard heading="No exercise is available for you" />
      )}
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    width: 30 * theme.vw,
    height: 25,
    borderRadius: 4,
    backgroundColor: theme.colors.lightPrimary,
    flexDirection: "row",
    alignSelf: "center",
  },
  button: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  buttonText: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
});

export default Exercises;
