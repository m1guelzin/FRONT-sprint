import {Link} from "react-router-dom"

function Home(){
    return(
        <div>
            <h1>Bem vindo ao sistema de Agendamentos</h1>
            <Link to="/login">Login</Link>
            <br />
            <Link to="/user">Cadastro</Link>
            <br />
        </div>
    )
}

export default Home;