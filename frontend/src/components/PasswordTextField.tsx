import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from "react";

export const PasswordTextField = (props: {
    handleChange: {
        (e: React.ChangeEvent<any>): void;
        <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ?
            void : (e: string | React.ChangeEvent<any>) => void;
    },
    touched: boolean | undefined,
    errors: string | undefined
}) => {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (

        <FormControl sx={{ margin: 1, width: "100%" }} variant="outlined"
            error={props.touched && Boolean(props.errors)}>
            <InputLabel htmlFor="password" sx={{ color: "black" }}>Password</InputLabel>
            <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                onChange={props.handleChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
            {Boolean(props.errors) && props.touched &&
                (<FormHelperText error={Boolean(props.errors)}>
                    {props.errors}
                </FormHelperText>)}
        </FormControl>
    );
}