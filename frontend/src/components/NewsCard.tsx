import { Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, Typography, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";


export type CardProps = {
    cardHeading: string;
    cardContent: string;
    cardImg: string | undefined;
    articleLink: string;
}

export const NewsCard = (props: CardProps) => {

    const theme = useTheme();

    return (
        <Card sx={{ margin: 4, backgroundColor: theme.palette.secondary.main, borderRadius: 3, width: "100%" }}>
            <CardActionArea LinkComponent="a" href={props.articleLink}>
                {props.cardImg ? 
                <CardMedia component="img"
                    height="140"
                    src={props.cardImg}
                    alt="" /> 
                    : ""}
                <CardContent>
                    <Box sx={{ height: 130, overflow: "hidden", textOverflow: "ellipsis", fontSize: 17, marginBottom: 1}}>
                        {props.cardHeading}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}