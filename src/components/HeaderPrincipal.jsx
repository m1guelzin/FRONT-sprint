import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

const HeaderPrincpal = () => {
  const styles = getStyles();

  return (
    <Box sx={styles.header}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_S%C3%A3o_Paulo_logo.png/1200px-SENAI_S%C3%A3o_Paulo_logo.png"
        alt="Logo"
        style={styles.logo}
      />
      <Avatar
        sx={{
          margin: 3,
          backgroundColor: "#9C9494",
        }}
      />
    </Box>
  );
};

function getStyles() {
  return {
    header: {
        backgroundColor: "#C5C2C2",
        height: "11vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
      headerText: {
        color: "#292929",
        fontSize: 30,
      },
      logo: {
        width: "250px",
        height: "auto",
        padding: "30px",
      },
  };
}

export default HeaderPrincpal;
