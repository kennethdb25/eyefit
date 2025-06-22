import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();
const useStyles = makeStyles(() => ({
  loginContainer: {
    backgroundImage: "url(/bg.png)",
    backgroundPosition: "center",
    backgroundSize: "100% 100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",

    [theme.breakpoints.up("md")]: {
      paddingLeft: "100px",
      justifyContent: "start",
    },
    [theme.breakpoints.down("md")]: {
      backgroundImage: "url(/cp-login.png)",
      paddingLeft: "0px",
      justifyContent: "center",
    },
  },
  loginCard: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
    background: "white",
    border: "1px lightgray solid",
    boxShadow: "rgb(109, 107, 107) 0px 20px 30px -10px",
    borderRadius: "10px",

    [theme.breakpoints.up("md")]: {
      width: "400px",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
  },
  loginDetails: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "10px",

    [theme.breakpoints.up("md")]: {
      width: "360px",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  whoComplaint: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
    background: "white",
    border: "1px lightgray solid",
    borderRadius: "10px",

    [theme.breakpoints.up("md")]: {
      width: "120%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  Form: {
    width: "100%",
    paddingTop: "20px",
  },
}));

export default useStyles;
