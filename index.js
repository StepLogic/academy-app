import { registerRootComponent } from "expo";
import App from "./App";
import { enGB, registerTranslation } from "react-native-paper-dates";
registerTranslation("en-GB", enGB);

// on top of your index.android.js file
const isAndroid = require("react-native").Platform.OS === "android"; // this line is only needed if you don't use an .android.js file
const isHermesEnabled = !!global.HermesInternal; // this line is only needed if you don't use an .android.js file

// in your index.js file
if (isHermesEnabled || isAndroid) {
  if ("__setDefaultTimeZone" in Intl.DateTimeFormat) {
    Intl.DateTimeFormat.__setDefaultTimeZone(
      require("expo-localization").timezone()
    );
  }
}

registerRootComponent(App);
