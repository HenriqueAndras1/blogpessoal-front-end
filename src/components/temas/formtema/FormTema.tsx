/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useContext, useEffect, useState } from "react"; // Importa hooks e tipos do React
import { RotatingLines } from "react-loader-spinner"; // Importa o componente de carregamento
import { useNavigate, useParams } from "react-router-dom"; // Importa hooks para navegação e parâmetros da URL
import { AuthContext } from "../../../contexts/AuthContext"; // Importa contexto de autenticação
import Tema from "../../../models/Tema"; // Importa o tipo Tema
import { atualizar, buscar, cadastrar } from "../../../services/Service"; // Importa funções de serviço (para interagir com a API)
import { ToastAlerta } from "../../../utils/ToastAlerta";

function FormTema() {
    // Definindo o hook de navegação
    const navigate = useNavigate();

    // Estado para armazenar os dados do tema e controle de carregamento
    const [tema, setTema] = useState<Tema>({} as Tema);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Obtendo o usuário e token do contexto de autenticação
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    // Obtendo o parâmetro de ID da URL (caso seja um tema para edição)
    const { id } = useParams<{ id: string }>();

    // Função para buscar o tema por ID
    async function buscarPorId(id: string) {
        try {
            // Fazendo a requisição para buscar o tema
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token }
            });
        } catch (error: any) {
            // Caso ocorra um erro (ex: 403 - não autorizado), realiza logout
            if (error.toString().includes('403')) {
                handleLogout();
            }
        }
    }

    // Efeito para verificar se o token está presente e redirecionar se não estiver
    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado!', "info");
            navigate('/');
        }
    }, [token]);

    // Efeito para buscar o tema quando o ID estiver presente
    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id);
        }
    }, [id]);

    // Função para atualizar o estado do tema conforme o usuário preenche o formulário
    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setTema({
            ...tema,
            [e.target.name]: e.target.value
        });
    }

    // Função para retornar à página de temas
    function retornar() {
        navigate("/temas");
    }

    // Função para gerar um novo tema ou atualizar um existente
    async function gerarNovoTema(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true); // Marca que o processo está em andamento

        if (id !== undefined) {
            // Caso exista um ID, é uma edição de tema
            try {
                await atualizar(`/temas`, tema, setTema, {
                    headers: { 'Authorization': token }
                });
                ToastAlerta('O Tema foi atualizado com sucesso!', "sucesso");
            } catch (error: any) {
                // Caso ocorra erro, realiza logout ou exibe erro genérico
                if (error.toString().includes('403')) {
                    handleLogout();
                } else {
                    ToastAlerta('Erro ao atualizar o tema.', "erro");
                }
            }
        } else {
            // Caso não exista um ID, é um cadastro de novo tema
            try {
                await cadastrar(`/temas`, tema, setTema, {
                    headers: { 'Authorization': token }
                });
                ToastAlerta('O Tema foi cadastrado com sucesso!', "sucesso");
            } catch (error: any) {
                // Caso ocorra erro, realiza logout ou exibe erro genérico
                if (error.toString().includes('403')) {
                    handleLogout();
                } else {
                    ToastAlerta('Erro ao cadastrar o tema.', "erro");
                }
            }
        }

        setIsLoading(false); // Marca que o processo foi finalizado
        retornar(); // Redireciona para a lista de temas
    }

    return (
        <div className="container flex flex-col items-center justify-center mx-auto">
            <h1 className="text-4xl text-center my-8">
                {/* Define o título dependendo se é cadastro ou edição */}
                {id === undefined ? 'Cadastrar Tema' : 'Editar Tema'}
            </h1>

            {/* Formulário para cadastrar ou editar tema */}
            <form className="w-1/2 flex flex-col gap-4" onSubmit={gerarNovoTema}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="descricao">Descrição do Tema</label>
                    <input
                        type="text"
                        placeholder="Descreva aqui seu tema"
                        name='descricao'
                        className="border-2 border-slate-700 rounded p-2"
                        value={tema.descricao}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <button
                    className="rounded text-slate-100 bg-sky-400 
                               hover:bg-sky-700 w-1/2 py-2 mx-auto flex justify-center"
                    type="submit">
                    {/* Exibe o carregamento ou o texto conforme o estado de loading */}
                    {isLoading ?
                        <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        /> :
                        <span>{id === undefined ? 'Cadastrar' : 'Atualizar'}</span>
                    }
                </button>
            </form>
        </div>
    );
}

export default FormTema;
