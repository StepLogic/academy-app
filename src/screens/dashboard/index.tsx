import { createMyNavigator } from "@components/Navigator";
import Feedback from "./agenda/Feedback";
import PersonalInfo from "./personal-info";
import Materials from "./materials";
import MaterialFileViewer from "./materials/MaterialFileViewer";
import Invoice from "./invoice";
import InvoiceFileViewer from "./invoice/InvoiceFileViewer";
import Exercises from "./exercises";
import Availability from "./availability";
import AgendaInner from "./agenda/AgendaInner";
import AgendaLanding from "./agenda/AgendaLanding";
import LayoutContext from "@api/context/LayoutContext";
import { View, ActivityIndicator } from "react-native";

import { useAppContext } from "@api/context/AppContext";
import { theme } from "@assets/theme";
import { Snackbar } from "react-native-paper";
const Navigator = createMyNavigator();
export default function Dashboard() {
  const { user, loading, showSnack, setShowSnack, showSplash, error } =
    useAppContext();
  return (
    <LayoutContext>
      {loading && (
        <View
          style={[
            {
              width: 40,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              borderRadius: 8,
              height: 40,
              backgroundColor: theme.colors.secondary,
              zIndex: 200,
              margin: 10,
              right: 0,
            },
          ]}
        >
          <ActivityIndicator animating={true} color={theme.colors.green} />
        </View>
      )}

      <Navigator.Navigator>
        <Navigator.Screen name="AgendaLanding" component={AgendaLanding} />
        <Navigator.Screen name="AgendaInner" component={AgendaInner} />
        <Navigator.Screen name="Feedback" component={Feedback} />
        <Navigator.Screen name="Availability" component={Availability} />
        <Navigator.Screen name="MaterialsLanding" component={Materials} />
        <Navigator.Screen name="InvoiceInner" component={InvoiceFileViewer} />
        <Navigator.Screen name="PersonalInfo" component={PersonalInfo} />
        <Navigator.Screen name="MaterialInner" component={MaterialFileViewer} />
        <Navigator.Screen name="InvoicesLanding" component={Invoice} />
        <Navigator.Screen name="ExercisesLanding" component={Exercises} />
      </Navigator.Navigator>
    </LayoutContext>
  );
}
