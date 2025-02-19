import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";

function Navbar() {

    const navigate = useNavigate();

    const { handleLogout } = useContext(AuthContext)

    function logout() {

        handleLogout()
        alert('O Usuário foi desconectado com sucesso!')
        navigate('/')
    }
    
    return (
        <>
            <div className='w-full bg-sky-400 text-white
                flex justify-center py-4'>

                <div className="container flex justify-between text-lg">
                    <Link to='/home' className="hover:opacity-75 text-2xl font-bold">BlogNet</Link>

                    <div className='flex gap-4'>
                        
                    <Link to='/postagens' className='hover:opacity-75'>Postagens
                    </Link>
                        
                        <Link to='/temas' className='hover:opacity-75'>Temas
                        </Link>
                        
                        <Link to='/cadastrartema' className='hover:opacity-75'>Cadastrar Tema
                        </Link>

                        <Link to='/perfil' className='hover:opacity-75'>Perfil
                        </Link>

                        <Link to='' onClick={logout} className='hover:opacity-75'>Sair
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar