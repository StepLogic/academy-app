// import { View } from "react-native";
import { View, Image, StyleSheet } from "react-native";
import Images from "@res/images";
import tw from "twrnc";
import { theme } from "assets/theme";
import { FontAwesome } from "@expo/vector-icons";
import Typography from "@components/common/Typography";
export default function AuthPageHeader() {
  return (
    <View style={tw`h-[40px] flex-row justify-between`}>
      <Image style={{ width: 94, height: 40 }} source={Images.logo} />
      <View
        style={{
          height: 22,
          flexDirection: "row",
        }}
      >
        <Typography
          style={{
            marginRight: 4,
            textDecorationLine: "underline",
            color: theme.colors.secondary,
          }}
        >
          Need help?
        </Typography>
        <FontAwesome name="whatsapp" size={19} color={theme.colors.secondary} />
      </View>
    </View>
  );
}
