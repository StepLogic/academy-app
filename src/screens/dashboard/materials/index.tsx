// import { useUIContext } from "@contexts/UIContext";
import { theme } from "@assets/theme";
import Button from "@components/common/Button";
import CommonLayout from "@components/common/CommonLayout";
import DateField from "@components/common/DateField";
import ItemCard from "@components/common/ItemCard";
import TextField from "@components/common/TextField";
import * as React from "react";
import { Entypo } from "@expo/vector-icons";
import { FlatList, StyleSheet, View } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/core";
import { useAppContext } from "@api/context/AppContext";
import NoItemCard from "@components/common/NoItemCard";
import moment from "moment";

const Materials = () => {
  const {
    user: { materials },
    updateUser,
  } = useAppContext();
  const navigate = useNavigation();
  const renderItem = React.useCallback(({ item, index }: any) => {
    const { type, name, token, lessonOf } = item;
    const renderMaterialType = () => {
      switch (type) {
        case "pdf":
          return "📝 Pdf";
        case "video":
          return "🎥 Video";
      }
    };
    // console.log("item", item);

    return (
      <ItemCard
        heading={name}
        subHeading={renderMaterialType() as string}
        prompt="Lesson of"
        value={moment(lessonOf).format("ddd DD/MM/yyyy")}
        showButton
        onPress={() =>
          navigate.navigate("MaterialInner", { type, name, token })
        }
        buttonAffix={
          <Entypo
            name="chevron-thin-right"
            size={24}
            color={theme.colors.primary}
          />
        }
      />
    );
  }, []);
  return (
    <CommonLayout
      heading="Materials"
      subHeading="Here you can view and download all the material used during the lesson"
    >
      {materials && materials.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          maxToRenderPerBatch={4}
          data={materials}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View key={"item-sep"} style={{ height: 20 }} />
          )}
        />
      ) : (
        <NoItemCard heading="No Exercises" />
      )}
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: theme.colors.white,
    borderRadius: 7,
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});

export default Materials;
