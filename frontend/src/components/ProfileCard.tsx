import {
    Avatar,
    Box,
    Card,
    Divider,
    FormControl,
    useTheme,
    InputLabel, OutlinedInput, Button, FormHelperText, AlertColor, Snackbar, Alert
} from "@mui/material"
import axios from "axios";
import { getAuth, onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { FormikContextType, useFormik } from "formik";
import { useEffect, useState } from "react";
import { object, string, ValidationError } from "yup";
import { useApiClient } from "../adapter/api/useApiClient";
import { app } from "../FirebaseAuthentication";
import { PasswordTextField } from "./PasswordTextField";

type Values = {
    firstName: string
    lastName: string
    email: string
    birthday: string
    password: string
}

export let formik: FormikContextType<Values>;

export const ProfileCard = () => {

    const theme = useTheme();
    const auth = getAuth(app);
    const api = useApiClient();

    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [uid, setUid] = useState("");
    const [initialValues, setInitialValues] = useState<Values>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        birthday: ""
    });

    const fetchData = () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    setUid(await user.getIdToken());
                    const fetchedUser = await api.getUserId(uid);
                    if (fetchedUser.status == 200) {
                        setInitialValues({
                            firstName: fetchedUser.data.firstName,
                            lastName: fetchedUser.data.lastName,
                            birthday: fetchedUser.data.birthday,
                            email: fetchedUser.data.email,
                            password: "",
                        });
                    }
                }
                catch (e) {
                    if (axios.isAxiosError(e) && e.response) {
                        const errorBody = e.response.data as ValidationError;
                        setAlertMessage(errorBody.message);
                        setSeverity("error");
                        setOpen(true);
                    }
                }
            }
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleClose = () => {
        setOpen(false);
        setAlertMessage("");
    };

    const validationSchema = object({
        firstName: string().required("First name is required"),
        lastName: string().required("Last name is required"),
        email: string().email("Enter a vaild E-Mail").required("E-Mail is required"),
        birthday: string().required("Birthday is required"),
        password: string()
            .min(6, "Password has to be at lease 6 characters long")
    });

    formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (auth.currentUser) {
                if (initialValues.email != values.email) {
                    updateEmail(auth.currentUser, values.email).then(() => {
                        // Email updated
                        setAlertMessage("E-Mail updated!");
                        setSeverity("success");
                        setOpen(true);
                    }).catch(() => {
                        // An error occurred
                        setAlertMessage("An error occurred while updating E-Mail!");
                        setSeverity("error");
                        setOpen(true);
                    });
                }
                updatePassword(auth.currentUser, values.password).then(() => {
                    // Password updated
                    setAlertMessage("Password updated!");
                    setSeverity("success");
                    setOpen(true);
                }).catch(() => {
                    // An error ocurred
                    setAlertMessage("An error occurred while updating password!");
                    setSeverity("error");
                    setOpen(true);
                });
                if (initialValues != values) {
                    const uid = auth.currentUser.getIdToken();
                    try {
                        const res = await api.putUserUpdateInformation(uid, { 
                            firstName: values.firstName,
                            lastName: values.lastName,
                            birthday: values.birthday,
                            email: values.email});
                        formik.setFieldValue("firstName", res.data.firstName);
                        formik.setFieldValue("lastName", res.data.lastName);
                        formik.setFieldValue("birthday", res.data.birthday);
                        formik.setFieldValue("email", res.data.email);
                    } catch (e) {
                        if (axios.isAxiosError(e) && e.response) {
                            const errorBody = e.response.data as ValidationError;
                            setAlertMessage(errorBody.message);
                            setSeverity("error");
                            setOpen(true);
                        }
                    }
                }

            }
        },
    });

    return (
        <>
            <Box sx={{
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
                height: "100%", width: "100%"
            }}>
                <Card sx={{
                    display: "flex", flexDirection: "column", flexWrap: "nowrap",
                    justifyContent: "flex-start", alignItems: "center",
                    backgroundColor: "#d3d3d3",
                    borderRadius: 4, margin: 10, width: "85%", position: "relative",
                    overflow: "visible"
                }}>
                    <Avatar sx={{
                        backgroundColor: theme.palette.secondary.main,
                        fontSize: theme.typography.h2,
                        width: 150, height: 150, position: "absolute", top: -70, zIndex: 3
                    }} />
                    <Box sx={{ fontSize: theme.typography.h2, marginTop: 13 }}>
                        User Name
                    </Box>
                    <Divider sx={{ color: theme.palette.text.primary, border: 1, width: "80%", margin: 4 }} />
                    <Box sx={{ width: "50%" }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Box sx={{
                                display: "flex", justifyContent: "center", alignItems: "center",
                                flexDirection: "column", marginBottom: 5
                            }}>
                                <FormField id="firstName" label="First Name" type="text" value={formik.values.firstName}
                                    touched={formik.touched.firstName} error={formik.errors.firstName} />

                                <FormField id="lastName" label="Last Name" type="text" value={formik.values.lastName}
                                    touched={formik.touched.lastName} error={formik.errors.lastName} />

                                <FormField id="email" label="E-Mail" type="email" value={formik.values.email}
                                    touched={formik.touched.email} error={formik.errors.email} />

                                <FormField id="birthday" label="" type="date" value={formik.values.birthday}
                                    touched={undefined} error={undefined} />

                                <PasswordTextField handleChange={formik.handleChange}
                                    touched={formik.touched.password} errors={formik.errors.password} />

                                <Button type="submit" sx={{
                                    width: "100%", marginTop: 2,
                                    color: theme.palette.text.secondary,
                                    backgroundColor: theme.palette.text.primary
                                }}>
                                    Update
                                </Button>
                                <Snackbar open={open} onClose={handleClose}
                                    autoHideDuration={4000}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                                    <Alert severity={severity} sx={{ width: '100%' }}>
                                        {alertMessage}
                                    </Alert>
                                </Snackbar>
                            </Box>
                        </form>
                    </Box>
                </Card>
            </Box>
        </>
    );
}

export const FormField = (props: {
    id: string, label: string, type: string, value: string
    touched: boolean | undefined, error: string | undefined
}) => {

    return (
        <FormControl sx={{ marginBottom: 2, width: "100%" }}
            error={props.touched && Boolean(props.error)}
            variant="outlined">
            <InputLabel htmlFor={props.id} sx={{ color: "black" }}>{props.label}</InputLabel>
            <OutlinedInput
                id={props.id}
                name={props.id}
                type={props.type}
                label={props.label}
                value={props.value}
                onChange={formik.handleChange}
            />
            {Boolean(props.error) && props.touched &&
                (<FormHelperText error={Boolean(props.error)}>
                    {props.error}
                </FormHelperText>)}
        </FormControl>
    );
}