import Typography from '@components/common/Typography'
import React from 'react'
import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Keyboard } from 'react-native'
import { theme } from "assets/theme";
import tw from "twrnc";
import TextField from '@components/common/TextField';
import { Button, Snackbar } from 'react-native-paper';
import * as yup from "yup";
import { useNavigation } from '@react-navigation/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import PhoneField from '@components/common/PhoneField';
import axios from 'axios';
import CalendarPicker from 'react-native-calendar-picker';

export const BASE_URL = "https://api.edusogno.com/api/admin/v1";

interface StepProps {
    nextStep?: () => void;
    showError: (message: string) => void;
    meetings?: object[];
}

const Registration = ({ nextStep, showError }: StepProps) => {
    const [loading, setLoading] = React.useState(false);

    const schema = yup.object().shape({
        email: yup.string().email().required(),
        name: yup.string().required(),
        lname: yup.string().required(),
        phone: yup.string().required(),
    });

    const navigate = useNavigation();

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });

    const submitData = async (data: any) => {

        console.log(BASE_URL + "/cr")
        try {
            const res = await axios.post(BASE_URL + "/crm", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (typeof nextStep === "function") {
                nextStep();
            }
        } catch (error) {
            showError("Qualcosa é andato storto, riprova piú tardi")
        }

        setLoading(false);
    }


    const onSubmit = async (data: any) => {
        setLoading(true);
        data = {
            ...data,
            phone: data.phone.replace(/\s/g, ''),
            offer: "Edusogno - app",
            status: 'Nuovo'
        }
        console.log({ data })
        submitData(data)
        Keyboard.dismiss();
    };
    return (
        <>
            <KeyboardAvoidingView
                behavior="height"
                style={styles.content}>
                <ScrollView style={[tw`px-[${5 * theme.vw}] flex-col`]}>
                    {/* <AuthPageHeader /> */}
                    <View >
                        <Typography
                            variant="displayMedium"
                            style={[
                                tw`text-center font-bold mt-[${2 * theme.vh}] mb-[${2 * theme.vh
                                    }]`,
                                { color: theme.colors.secondary, fontFamily: "Poppins-Semibold" },
                            ]}
                        >
                            Vuoi migiorare il tuo inlgese?
                        </Typography>

                        <Typography
                            variant="headlineSmall"
                            style={[
                                tw`text-center font-semibold mt-[${1 * theme.vh}] mb-[${4 * theme.vh
                                    }]`,
                                { color: theme.colors.secondary, fontFamily: "Poppins-Semibold" },
                            ]}
                        >
                            Lasciaci il tuo contatto e ti richiameremo
                        </Typography>
                    </View>

                    <View style={tw` flex flex-col mb-8`}>
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

                        <PhoneField
                            name='phone'
                            control={control}
                            placeholderTextColor={theme.colors.primary}
                            label={"Qual è il tuo numero di telefono?"}
                            placeholder="1234567890"
                            style={tw` mb-2`}
                        />

                        <TextField
                            placeholder="name@example.com "
                            placeholderTextColor={theme.colors.primary}
                            label={"Qual è la tua email?"}
                            name="email"
                            control={control}
                            style={tw` mb-2`}
                        />
                    </View>

                    <Button
                        buttonColor={theme.colors.button}
                        mode="contained"
                        style={tw``}
                        loading={loading}
                        onPress={handleSubmit(onSubmit)}
                    >
                        RICHIEDI INFO
                    </Button>

                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

const ScheduleMeeting = ({ meetings, showError }: StepProps) => {
    const [loading, setLoading] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(new Date());


    return (
        <>
            <CalendarPicker
                todayBackgroundColor={'transparent'}
                minDate={new Date()}
                selectedDayColor={theme.colors.button}
                onDateChange={(date: React.SetStateAction<Date>) => setSelectedDate(date)}
            />
        </>
    )

}

const Register = () => {

    const [step, setStep] = React.useState(1);
    const [showSnack, setShowSnack] = React.useState(false);
    const [error, setError] = React.useState("");
    const [meetings, setMeetings] = React.useState([]);

    const nextStep = () => {
        setStep(prev => prev + 1);
    }

    const showError = (error: string) => {
        setError(error);
        setShowSnack(true);
    }

    const fetchMeetings = async () => {
        try {
            const res = await axios.post(BASE_URL + "/calendar-events", {
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
            });
            console.log(res.data[0])
            setMeetings(res.data[0]);
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        // fetchMeetings();
    }, [])

    return (
        <View style={styles.root}>
            {
                step === 0 ? <Registration nextStep={nextStep} showError={showError} /> : <ScheduleMeeting meetings={meetings} showError={showError} />
            }


            <Snackbar
                style={{
                    backgroundColor: theme.colors.secondary,
                    // color: theme.colors.red,
                }}
                duration={4000}
                visible={showSnack}
                onDismiss={() => {
                    setShowSnack(false);
                }}
            >
                {error}
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        // width: theme.vw * 100,
        flexDirection: "column",
        backgroundColor: theme.colors.lightPrimary,
        position: "relative",
        // alignItems: "center",
    },
    content: {
        flex: 8,
        paddingTop: 3 * theme.vh,
        paddingBottom: 4 * theme.vh,
    },
    lowerSection: {
        flex: 4,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
});


export default Register;