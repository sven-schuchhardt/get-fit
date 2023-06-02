import { Alert, AlertColor, Box, Divider, Snackbar, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { NewsCard } from "./NewsCard";
import { SectionHeading } from "./SectionHeading";

export type Article = {
    source: {
        id: string;
        name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}

export const NewsSection = () => {

    const theme = useTheme();
    const [topArticles, setTopArticles] = useState<Article[]>([]);
    const [bottomArticles, setBottomArticles] = useState<Article[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");

    const fetchHeader = {
        "method": "GET",
        headers: {
            "X-Api-Key": import.meta.env.APP_NEWS_X_API_KEY
        }
    }

    const fetchUrl = import.meta.env.APP_NEWS_URL;

    const fetchData = async () => {
        try {
            const response = await fetch(fetchUrl, fetchHeader);
            if (response.ok) {
                const newsCardData = await response.json();
                setTopArticles(newsCardData.articles.slice(0, 4));
                setBottomArticles(newsCardData.articles.slice(4, 9));
            }
        } catch (error) {
            setAlertMessage("Error while loading news!");
            setSeverity("error");
            setIsOpen(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderNewsCard = ({ title, ...rest }: Article) => {
        return <NewsCard key={title} cardHeading={title}
            cardContent={rest.description}
            cardImg={rest.urlToImage}
            articleLink={rest.url} />
    }

    return (
        <>
            <Box className="header-background" sx={{
                backgroundColor: theme.palette.background.paper,
                display: "flex", justifyContent: "center", height: 170
            }}>
                <SectionHeading heading="News"/>
            </Box>
            <Box sx={{
                display: "flex", justifyContent: "space-evenly",
                alignItems: "flex-start", margin: 2, marginX: 13
            }}>
                {topArticles.map(renderNewsCard)}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Divider variant="middle" sx={{
                    border: 0.5, width: "50%",
                    color: theme.palette.secondary.main
                }} />
            </Box>
            <Box sx={{
                display: "flex", justifyContent: "space-evenly",
                alignItems: "center", margin: 2, marginX: 13
            }}>
                {bottomArticles.map(renderNewsCard)}
            </Box>
            <Snackbar open={isOpen} onClose={() => setIsOpen(false)}
                autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={severity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
}