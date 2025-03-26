import React from "react";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";

const Footer = () => {
    const styles = getStyles();

    return (
      <Box sx={styles.footer}>
        <Typography sx={styles.footerText}>&copy; SENAI Franca SP</Typography>
      </Box>
    );
  };



  function getStyles() {
    return {
        footer: {
            backgroundColor: "#C5C2C2",
            height: "7vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bottom: 0, // Cola o footer na parte inferior
            left: 0,
            
          },
          footerText: {
            fontSize: 18,
          },
    }
  }

  export default Footer;