// import { useUIContext } from "@contexts/UIContext";
// import { BASE_URL } from "@api/Api";
import { useLayoutLogic } from "@api/context/LayoutContext";
import { BASE_URL } from "../../../api/Api";
import { theme } from "@assets/theme";
import VideoPlayer from "@components/common/VidePlayer";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/core";
import { Video, AVPlaybackStatus } from "expo-av";
import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import tw from "twrnc";

// const PdfReader = ({ url: uri }: { url: string }) => (
//   <WebView
//     style={{
//       flex: 1,
//       width: "100%",
//       height: 200,
//     }}
//     // javaScriptEnabled={true}
//     // source={{ uri: "https://expo.dev" }}
//     javaScriptEnabled={true}
//     source={{ uri: "http://docs.google.com/gview?embedded=true&url=" + uri }}
//     startInLoadingState={true}
//     scalesPageToFit={true}
//     originWhitelist={["*"]}
//   />
// );
const MaterialFileViewer = ({ route }) => {
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

  if (route.params?.token) {
    const { token: tk, type } = route.params;
    return type === "pdf" ? (
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
            BASE_URL +
            "v1/video/stream/" +
            tk,
        }}
        startInLoadingState={true}
        scalesPageToFit={true}
        originWhitelist={["*"]}
      />
    ) : (
      <VideoPlayer
        videoProps={{
          source: {
            uri: BASE_URL + "v1/video/stream/" + tk,
          },
        }}
        style={tw`h-[${theme.vh * 60}px]`}
      />
    );
  }
  return <></>;
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

export default MaterialFileViewer;
