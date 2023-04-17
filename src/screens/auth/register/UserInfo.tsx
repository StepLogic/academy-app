import PhoneField from "@components/common/PhoneField";
import TextField from "@components/common/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/core";
import { theme } from "assets/theme";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, View, StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import tw from "twrnc";
import * as yup from "yup";

export const BASE_URL = "https://api.edusogno.com/api/admin/v1";
const UserInfo = ({ nextStep, showError }: any) => {
  const [loading, setLoading] = React.useState(false);

  const [steps, setSteps] = useState(0);

  const schema = yup.object().shape({
    email: yup.string().email("Email non valido").required(),
    name: yup.string().required("Nome richiesta"),
    lname: yup.string().required("Cognome richiesta"),
    phone: yup
      .string()
      .required()
      .matches(
        /^[\+]?[(]?[ \0-9]{4}[)]?[-\s\.]?[ \0-9]{4}[-\s\.]?[ \0-9]{6,8}$/gm,
        "Telefono non valido"
      ),
  });

  const navigate = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getFieldState,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const nextFormStep = async () => {
    if (steps == 0) {
      const res = await trigger(["name", "lname"]);
      if (res && Object.values(errors).length === 0) {
        setSteps((r) => r + 1);
        return;
      }
    }
    if (steps == 1) {
      const res = await trigger("phone");
      if (res && Object.values(errors).length === 0) {
        setSteps((r) => r + 1);
        return;
      }
    }
    if (steps == 2) {
      const res = await trigger("email");
      if (res && Object.values(errors).length === 0) {
        handleSubmit(onSubmit)();
        return;
      }
    }
  };

  const submitData = async (data: any) => {
    console.log(BASE_URL + "/cr");
    try {
      const res = await axios.post(BASE_URL + "/crm", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (typeof nextStep === "function") {
        nextStep();
      }
    } catch (error) {
      showError("Qualcosa é andato storto, riprova piú tardi");
    }

    setLoading(false);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    data = {
      ...data,
      phone: data.phone.replace(/\s/g, ""),
      offer: "Edusogno - app",
      status: "Nuovo",
    };
    console.log({ data });
    submitData(data);
    Keyboard.dismiss();
  };
  return (
    <>
      <View style={[tw`px-[${5 * theme.vw}] flex-1 flex-col pt-4`]}>
        {steps === 0 && (
          <>
            <TextField
              placeholder="Mario"
              placeholderTextColor={theme.colors.primary}
              label={"Qual é il tuo nome?"}
              name="name"
              control={control}
              style={tw` mb-2`}
            />
            <TextField
              placeholder="Rossi"
              placeholderTextColor={theme.colors.primary}
              label={"Qual è il tuo cognome?"}
              name="lname"
              control={control}
              style={tw` mb-2`}
            />
          </>
        )}

        {steps == 1 && (
          <PhoneField
            name="phone"
            control={control}
            placeholderTextColor={theme.colors.primary}
            label={"Qual è il tuo numero di telefono?"}
            placeholder="1234567890"
            style={tw` my-auto`}
          />
        )}
        {steps === 2 && (
          <TextField
            placeholder="name@example.com "
            placeholderTextColor={theme.colors.primary}
            label={"Qual è la tua email?"}
            name="email"
            control={control}
            style={tw` my-auto`}
          />
        )}
      </View>

      <View style={tw`flex-row justify-center items-center`}>
        {steps !== 0 && (
          <FAB
            color={theme.colors.white}
            style={[styles.directionButton, tw`mr-4`]}
            small
            onPress={() => setSteps((r) => r - 1)}
            icon={"chevron-left"}
          />
        )}
        <FAB
          color={theme.colors.white}
          small
          style={styles.directionButton}
          loading={loading}
          onPress={() => nextFormStep()}
          icon={"chevron-right"}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  directionButton: {
    borderRadius: 100,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.green,
  },
});
export default UserInfo;
