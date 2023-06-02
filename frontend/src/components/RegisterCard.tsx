import {
    Box, Card, FormControl, OutlinedInput, InputLabel, useTheme,
    Button, FormHelperText, Link, AlertColor, Snackbar, Alert
} from "@mui/material";
import { FormikContextType, useFormik } from "formik";
import { PasswordTextField } from "./PasswordTextField";
import { object, string, date} from "yup";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from "react-router";
import { useState } from "react";
import { app } from "../FirebaseAuthentication";
import axios from "axios";
import { useApiClient } from "../adapter/api/useApiClient";

type Values = {
    firstName: string
    lastName: string
    email: string
    birthday: Date
    password: string
}

let formik: FormikContextType<Values>;

export const RegisterCard = () => {

    const theme = useTheme();
    const auth = getAuth(app);
    const api = useApiClient();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");

    const handleClose = () => {
        setOpen(false);
        setAlertMessage("");
    }

    const validationSchema = object({
        firstName: string().required("First name is required"),
        lastName: string().required("Last name is required"),
        email: string().email("Enter a vaild E-Mail").required("E-Mail is required"),
        birthday: date().required("Birthday is required"),
        password: string()
            .min(6, "Password has to be at lease 6 characters long")
            .required("Password is required")
    });

    formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            birthday: new Date(),
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            await createUserWithEmailAndPassword(auth, values.email, values.password)
                .then(async (userCredential) => {
                    // User created
                    const uid = userCredential.user.uid;
                    try {
                        const res = await api.postAuthRegister({
                            firstName: values.firstName,
                            lastName: values.lastName,
                            birthday: values.birthday,
                            email: values.email,
                            firebaseUid: uid
                        });
                        if (res?.status == 201) {
                            localStorage.setItem("currentlySignedUp", "true");
                            navigate("/home");
                        }
                    } catch (e) {
                        if (axios.isAxiosError(e) && e.response) {
                            const errorBody = e.response.data;
                            setAlertMessage(errorBody.errors);
                            setSeverity("error");
                            setOpen(true);
                        }
                    }
                })
                .catch((error) => {
                    setAlertMessage(error.message);
                    setSeverity("error");
                    setOpen(true);
                });
        },
    });

    return (
        <Card sx={{
            display: "flex", flexDirection: "column", flexWrap: "nowrap",
            justifyContent: "space-around", alignItems: "center",
            backgroundColor: theme.palette.secondary.main,
            borderRadius: 4, marginY: 5,
            width: 480
        }}>
            <Box sx={{
                color: theme.palette.text.primary,
                typography: theme.typography.h2,
                marginY: 3
            }}>
                Sign up
            </Box>
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{
                    display: "flex", justifyContent: "center", alignItems: "center",
                    flexDirection: "column", marginBottom: 5
                }}>
                    <FormField id="firstName" label="First Name" type="text"
                        touched={formik.touched.firstName} error={formik.errors.firstName} />

                    <FormField id="lastName" label="Last Name" type="text"
                        touched={formik.touched.lastName} error={formik.errors.lastName} />

                    <FormField id="email" label="E-Mail" type="email"
                        touched={formik.touched.email} error={formik.errors.email} />

                    <FormField id="birthday" label="" type="date"
                        touched={undefined} error={undefined} />

                    <PasswordTextField handleChange={formik.handleChange} touched={formik.touched.password}
                        errors={formik.errors.password} />

                    <Button type="submit" sx={{
                        width: "100%", marginTop: 3,
                        color: theme.palette.text.secondary,
                        backgroundColor: theme.palette.text.primary,
                    }}>
                        Sign up
                    </Button>
                    <Link href="/login" underline="hover"
                        sx={{ marginTop: 3, color: "black", fontSize: theme.typography.body1 }}>
                        Already have an account? Sign in
                    </Link>
                    <Snackbar open={open} onClose={handleClose}
                        autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                        <Alert severity={severity} sx={{ width: '100%' }}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </form>
        </Card>
    );
}

export const FormField = (props: {
    id: string, label: string, type: string,
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
                onChange={formik.handleChange}
            />
            {Boolean(props.error) && props.touched &&
                (<FormHelperText error={Boolean(props.error)}>
                    {props.error}
                </FormHelperText>)}
        </FormControl>
    );
}