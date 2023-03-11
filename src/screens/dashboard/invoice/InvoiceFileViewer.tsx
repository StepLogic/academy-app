// import { useUIContext } from "@contexts/UIContext";
import { theme } from "@assets/theme";
import Button from "@components/common/Button";
import CommonLayout from "@components/common/CommonLayout";
import DateField from "@components/common/DateField";
import ItemCard from "@components/common/ItemCard";
import TextField from "@components/common/TextField";
import * as React from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import tw from "twrnc";
import Typography from "@components/common/Typography";
import { useLayoutLogic } from "@api/context/LayoutContext";
import { useNavigation } from "@react-navigation/core";

const InvoiceFileViewer = ({route}) => {
  const { setBurgerButton } = useLayoutLogic();
  const navigate = useNavigation();

  React.useEffect(() => {
    if (
      navigate.getState().routeNames[navigate.getState().index] ===
      "MaterialInner"
    ) {
      setBurgerButton(
        <TouchableOpacity
          onPress={() => {
            navigate.navigate("InvoicesLanding");
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
  const type = "pdf";
  return (
    <WebView
      style={{
        flex: 1,
        width: "100%",
        height: 200,
      }}
      javaScriptEnabled={true}
      source={{
        uri:
          "http://docs.google.com/gview?embedded=true&url=" +
          "http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
      }}
      startInLoadingState={true}
      scalesPageToFit={true}
      originWhitelist={["*"]}
    />
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

export default InvoiceFileViewer;
