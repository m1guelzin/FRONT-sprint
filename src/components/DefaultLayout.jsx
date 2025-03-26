import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import HeaderPrincpal from "./HeaderPrincipal";

const DefaultLayout = ({ children, headerRender, mensagem}) => {
  return (
    <div>
        {headerRender === 1 ? (
                  <Box sx={{ display: "flex", flexDirection: "column"}}>
                  <Header mensagem={mensagem}/>
                  {/* AQUI VEM O CONTEUDO DA PAGINA */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      border: "none",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {children}
                  </Box>
          
                  <Footer />
                </Box>
        ) : (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
            <HeaderPrincpal />
            {/* AQUI VEM O CONTEUDO DA PAGINA */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                border: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {children}
            </Box>
    
            <Footer />
          </Box>
        )}

    </div>
  );
};

export default DefaultLayout;
