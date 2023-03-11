// import { TextInput as RNPTextInput } from "react-native-paper";
import { Pressable, StyleSheet, View } from "react-native";
import {
  HelperText,
  TextInput,
  TextInputProps,
  useTheme,
} from "react-native-paper";
import Typography from "./Typography";
import { theme } from "assets/theme";
import { useEffect, useState } from "react";
import { DatePickerInput, DatePickerModal } from "react-native-paper-dates";
import React from "react";
import moment from "moment";
import TextField from "./TextField";
import { Moment } from "moment";
import { getDate } from "../../screens/dashboard/agenda/calendar";
import { useController } from "react-hook-form";
type Props = { control: any; name: string } & TextInputProps;
function DateField(props: Props) {
  const {
    style,
    label,
    placeholderTextColor,
    underlineColor,
    control,
    name,
    activeOutlineColor,
    ...rest
  } = props;
  const theme = useTheme();
  const [date, setDate] = React.useState<any>(undefined);
  // const [internal, setInternal] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);

  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
  });
  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const formatDateSelection = (_) => JSON.stringify(_).split("T")[0].slice(1);
  const onConfirmSingle = React.useCallback(
    (params: any) => {
      setOpen(false);
      field.onChange(formatDateSelection(params.date));
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  useEffect(() => {
    setDate(new Date(field.value));
  }, [field.value]);
  return (
    <View style={styles.root}>
      {label && (
        <Typography style={styles.label} variant="labelLarge">
          {label}
        </Typography>
      )}
      <Pressable
        onPress={() => {
          console.log("clicked");
          setOpen(true);
        }}
      >
        <TextInput
          mode="flat"
          underlineColor={
            underlineColor || (theme.colors as any).textUnderlineColorLight
          }
          textColor={theme.colors.secondary}
          placeholderTextColor={placeholderTextColor || "#CCCCCC"}
          activeUnderlineColor={activeOutlineColor || theme.colors.primary}
          style={[styles.rootInput]}
          value={
            typeof date === "undefined"
              ? ""
              : String(moment(field.value, "YYYY-MM-DD").format("DD/MM/yyyy"))
          }
          placeholder="mm/dd/yyyy"
          onPressIn={() => setOpen(true)}
          disabled={true}
        />
      </Pressable>
      <HelperText type="error" visible={Boolean(error) || Boolean(invalid)}>
        {error?.message}
      </HelperText>
      <DatePickerModal
        locale="en-GB"
        mode="single"
        endDate={2018}
        visible={open}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
    </View>
  );
}
export default DateField;
const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  rootInput: {
    borderRadius: 8,
    borderStyle: "solid",
    width: "100%",
    height: 59,
    paddingHorizontal: theme.inputPaddingHorizontal,
    backgroundColor: "transparent",
    paddingVertical: theme.inputPaddingVertical,
    fontSize: 20,
    fontFamily: "Poppins-Medium",
    color: theme.colors.secondary,
  },
  label: {
    color: theme.colors.secondary,
    // fontWeight: "700",
    fontFamily: "Poppins-Medium",
  },
});
