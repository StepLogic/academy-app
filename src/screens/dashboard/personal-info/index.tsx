// import { useUIContext } from "@contexts/UIContext";
import { theme } from "@assets/theme";
import Button from "@components/common/Button";
import CommonLayout from "@components/common/CommonLayout";
import DateField from "@components/common/DateField";
import PhoneField from "@components/common/PhoneField";
import TextField from "@components/common/TextField";
import * as React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { useAppContext } from "@api/context/AppContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
const PersonalInfo = () => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    cognome: yup.string().required(),
    nome: yup.string().required(),
    cell: yup.string().required(),
    data_di_nascita: yup.string().required(),
  });
  const {
    user: { user },
    updateUser,
  } = useAppContext();

  const { control, handleSubmit, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: user,
  });
  const onSubmit = async (data) => {
    const vl = await updateUser({ ...user, ...data }, user.token);
  };
  // console.log("user", user, getValues());
  return (
    <CommonLayout
      heading="Personal info"
      subHeading="Modify the information related to this account below"
    >
      <KeyboardAwareScrollView style={[styles.root]}>
        <View style={[styles.content]}>
          <TextField
            style={styles.field}
            label={"First Name"}
            placeholder="Mario"
            name="nome"
            dense
            control={control}
          />
          <TextField
            style={styles.field}
            label={"Family Name"}
            placeholder="Lipocadri"
            dense
            name="cognome"
            control={control}
          />
          <TextField
            style={styles.field}
            name="email"
            dense
            label={"Email address"}
            placeholder="john@example.com"
            control={control}
          />
          <PhoneField
            name="cell"
            style={styles.field}
            dense
            control={control}
            label={"Whatsapp Phone Number"}
          />
          <DateField
            name="data_di_nascita"
            style={styles.field}
            label={"Date of birth"}
            dense
            control={control}
          />
        </View>

        <Button
          mode="contained"
          style={{ marginTop: 15 }}
          onPress={handleSubmit(onSubmit)}
          buttonColor={theme.colors.button}
        >
          Save
        </Button>
      </KeyboardAwareScrollView>
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  content: {
    backgroundColor: theme.colors.white,
    borderRadius: 7,
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  field: {
    marginBottom: 15,
  },
});

export default PersonalInfo;
