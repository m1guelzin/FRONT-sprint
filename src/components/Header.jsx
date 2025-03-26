import React from "react";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";

const Header = ({mensagem}) => {
    const styles = getStyles();

    return (
        <Box sx={styles.header}>
        <Typography sx={styles.headerText}>{mensagem}</Typography>
      </Box>
    );
  };



  function getStyles() {
    return {
        header: {
            backgroundColor: "#C5C2C2",
            height: "10vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: 0,
            left: 0,
          },
          headerText: {
            color: "#292929",
            fontSize: 30,
          },
    } 
  }

  export default Header;