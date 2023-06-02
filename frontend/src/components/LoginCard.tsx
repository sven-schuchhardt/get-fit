import {
    Box, Card, FormControl, OutlinedInput, InputLabel, useTheme, Button, Link,
    FormHelperText, AlertColor, Alert, Snackbar
} from "@mui/material";
import { useFormik } from "formik";
import { PasswordTextField } from "./PasswordTextField";
import { object, string } from "yup";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import { useState } from "react";
import { app } from "../FirebaseAuthentication";

export const validationSchema = object({
    email: string()
        .email("Enter a vaild email")
        .required("Email is required"),
    password: string()
        .required("Password is required"),
});

export const LoginCard = () => {

    const theme = useTheme();
    const auth = getAuth(app);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");

    const handleClose = () => {
        setOpen(false);
        setAlertMessage("");
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values);

            signInWithEmailAndPassword(auth, values.email, values.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    //Save currently logged in status for HomePage.tsx
                    localStorage.setItem("currentlyLoggedIn", "true");
                    navigate("/home");
                })
                .catch((error) => {
                    setAlertMessage("Error occured while login!");
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
            borderRadius: 4,
            width: 480, height: 550
        }}>
            <Box sx={{ color: theme.palette.text.primary, typography: theme.typography.h2 }}>Login</Box>
            <form onSubmit={formik.handleSubmit}>

                <Box sx={{
                    display: "flex", justifyContent: "center", alignItems: "center",
                    flexDirection: "column", marginBottom: 5
                }}>
                    <FormControl sx={{ marginBottom: 2, width: "100%" }}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        variant="outlined">
                        <InputLabel htmlFor="email" sx={{ color: "black" }}>E-Mail</InputLabel>
                        <OutlinedInput
                            id="email"
                            name="email"
                            type="email"
                            label="E-Mail"
                            onChange={formik.handleChange}
                        />
                        {Boolean(formik.errors.email) && formik.touched.email &&
                            (<FormHelperText error={Boolean(formik.errors.email)}>
                                {formik.errors.email}
                            </FormHelperText>)}
                    </FormControl>

                    <PasswordTextField handleChange={formik.handleChange} touched={formik.touched.password}
                        errors={formik.errors.password} />

                    <SubmitButton />
                    <Link href="/register" underline="hover"
                        sx={{ marginTop: 3, color: "black", fontSize: theme.typography.body1 }}>
                        No account yet? Sign up!
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

export const SubmitButton = () => {

    const theme = useTheme();

    return (
        <Button type="submit" sx={{
            width: "100%", marginTop: 4,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.text.primary,
        }}>
            Login
        </Button>
    );
}