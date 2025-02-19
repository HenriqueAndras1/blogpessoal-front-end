/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import Tema from "../../../models/Tema"
import { buscar, deletar } from "../../../services/Service"
import { RotatingLines } from "react-loader-spinner"

function DeletarTema() {
    // Hook para navegação entre páginas
    const navigate = useNavigate()

    // Estado local para armazenar o tema e o status de carregamento
    const [tema, setTema] = useState<Tema>({} as Tema)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Contexto de autenticação para acessar o usuário logado e o token
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    // Obtendo o ID do tema via parâmetros de URL
    const { id } = useParams<{ id: string }>()

    // Função assíncrona para buscar o tema pelo ID
    async function buscarPorId(id: string) {
        try {
            // Chamada ao serviço para buscar o tema
            await buscar(`/temas/${id}`, setTema, {
                headers: {
                    'Authorization': token // Cabeçalho de autorização com o token do usuário
                }
            })
        } catch (error: any) {
            // Se ocorrer erro 403 (não autorizado), faz logout do usuário
            if (error.toString().includes('403')) {
                handleLogout()
            }
        }
    }

    // useEffect para verificar se o usuário está logado, caso contrário, redireciona para a página inicial
    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado')
            navigate('/')
        }
    }, [token])

    // useEffect para buscar o tema assim que o ID for definido
    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id)
        }
    }, [id])

    // Função para deletar o tema
    async function deletarTema() {
        setIsLoading(true) // Ativa o loading

        try {
            // Chamada ao serviço para deletar o tema
            await deletar(`/temas/${id}`, {
                headers: {
                    'Authorization': token // Cabeçalho de autorização
                }
            })

            alert('Tema apagado com sucesso') // Exibe um alerta de sucesso
        } catch (error: any) {
            // Se erro 403 (não autorizado), faz logout do usuário
            if (error.toString().includes('403')) {
                handleLogout()
            } else {
                alert('Erro ao deletar o tema.') // Exibe um alerta de erro
            }
        }

        setIsLoading(false) // Desativa o loading
        retornar() // Chama a função para redirecionar à lista de temas
    }

    // Função para redirecionar para a página de temas
    function retornar() {
        navigate("/temas")
    }

    // JSX do componente
    return (
        <div className='container w-1/3 mx-auto'>
            <h1 className='text-4xl text-center my-4'>Deletar tema</h1>
            <p className='text-center font-semibold mb-4'>
                Você tem certeza de que deseja apagar o tema a seguir?</p>
            <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>
                <header 
                    className='py-2 px-6 bg-sky-400 text-white font-bold text-2xl'>
                    Tema
                </header>
                <p className='p-8 text-3xl bg-slate-200 h-full'>{tema.descricao}</p>
                <div className="flex">
                    {/* Botão para cancelar a operação */}
                    <button 
                        className='text-slate-100 bg-red-600 hover:bg-red-800 w-full py-2'
                        onClick={retornar}>
                        Não
                    </button>
                    {/* Botão para confirmar a exclusão do tema */}
                    <button 
                        className='w-full text-slate-100 bg-green-500
                                   hover:bg-green-700 flex items-center justify-center'
                                   onClick={deletarTema}>
                        {isLoading ? 
                            // Exibe o spinner de loading enquanto a operação é realizada
                            <RotatingLines
                                strokeColor="white"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="24"
                                visible={true}
                            /> : 
                            <span>Sim</span> // Caso contrário, exibe o texto "Sim"
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeletarTema
