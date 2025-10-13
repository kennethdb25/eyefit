import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();
const useStyles = makeStyles(() => ({
    container: {
        background: "linear-gradient(135deg, #b8d8c1, #d9f0e6)", // Soft green gradient
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "30px 25px",
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "20px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        [theme.breakpoints.up("md")]: {
            width: "400px",
        },
        [theme.breakpoints.down("md")]: {
            width: "90%",
        },
    },
    title: {
        fontWeight: "bold !important",
        color: "#4b5d50 !important", // Muted deep green-gray
        marginBottom: "15px !important",
        fontSize: "26px !important",
        textAlign: "center",
        letterSpacing: "1px",
    },
    subtitle: {
        color: "#6f7f74 !important",
        marginBottom: "20px !important",
        textAlign: "center",
    },
    inputField: {
        borderRadius: "50px !important",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #b8d8c1 !important",
        "&:focus-within": {
            borderColor: "#8fbf9f !important",
            boxShadow: "0 0 5px rgba(184, 216, 193, 0.8)",
        },
    },
    button: {
        width: "100% !important",
        borderRadius: "50px !important",
        fontWeight: "bold !important",
        letterSpacing: "1px !important",
        background: "#b8d8c1 !important",
        border: "none !important",
        color: "#2f3e34 !important",
        marginTop: "10px !important",
        "&:hover": {
            background: "#a6cdb1 !important", // Slightly darker pastel green
        },
    },
    form: {
        width: "100%",
    },
}));

export default useStyles;