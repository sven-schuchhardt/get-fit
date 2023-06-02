import { Box, useTheme } from "@mui/material";

export const SectionHeading = (props: {heading: string}) => {

    const theme = useTheme();
    const barbellPalteWidth = 22;
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <HeadingBarbellPlates barbellPalteWidth={barbellPalteWidth} flexDirection="row-reverse" />
                <Box sx={{ margin: 4, color: theme.palette.text.secondary, fontSize: theme.typography.h2 }}>
                    {props.heading}
                </Box>
                <HeadingBarbellPlates barbellPalteWidth={barbellPalteWidth} flexDirection="row" />
            </Box>
        </>
    );
}

export const HeadingBarbellPlates = (props: { barbellPalteWidth: number, flexDirection: string }) => {

    return (
        <Box sx={{ display: "flex", flexDirection: props.flexDirection, justifyContent: "center", alignItems: "center" }}>
            <BarbellPlate height={80} width={props.barbellPalteWidth} />
            <BarbellPlate height={50} width={props.barbellPalteWidth} />
            <BarbellPlate height={20} width={props.barbellPalteWidth} />
        </Box>
    );
}

export const BarbellPlate = (props: { height: number, width: number }) => {

    const theme = useTheme();
    return (
        <Box sx={{ backgroundColor: theme.palette.secondary.main, height: props.height, width: props.width, margin: 1 }} />
    );
}