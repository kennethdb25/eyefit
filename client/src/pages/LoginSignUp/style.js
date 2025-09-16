import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();
const useStyles = makeStyles(() => ({
  loginContainer: {
    background: "linear-gradient(135deg, #b8d8c1, #d9f0e6)", // Soft green gradient
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  loginCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "40px 30px",
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
    fontWeight: "bold",
    color: "#4b5d50", // Muted deep green-gray for contrast
    marginBottom: "20px",
    fontSize: "28px",
    letterSpacing: "1px",
  },
  inputField: {
    borderRadius: "50px !important",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #b8d8c1",
    "&:focus-within": {
      borderColor: "#8fbf9f", // Slightly deeper green when focused
      boxShadow: "0 0 5px rgba(184, 216, 193, 0.8)",
    },
  },
  forgotWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "15px",
  },
  loginDetails: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    borderRadius: "50px !important",
    fontWeight: "bold",
    letterSpacing: "1px",
    background: "#b8d8c1",
    border: "none",
    color: "#2f3e34",
    "&:hover": {
      background: "#a6cdb1", // Slightly darker pastel green
    },
  },
  Form: {
    width: "100%",
    marginTop: "20px",
  },
}));

export default useStyles;
