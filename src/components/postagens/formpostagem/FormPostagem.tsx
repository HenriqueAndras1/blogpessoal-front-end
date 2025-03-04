/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import Postagem from "../../../models/Postagem";
import Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../services/Service";
import { RotatingLines } from "react-loader-spinner";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function FormPostagem() {

    // Hook para gerenciar a navegação do usuário, caso token nao esteja autenticado retornar a pagina de login
    const navigate = useNavigate();

    // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Váriavel de Estado que recebe os dados de todos os Temas cadastrados no Back and - Usado para listar os temas e permitir que o usuário escolha qual tema será vinculado a Postagem
    const [temas, setTemas] = useState<Tema[]>([])

    // Estado para armazenar a postagem sendo criada ou editada
    const [tema, setTema] = useState<Tema>({ id: 0, descricao: '', })


    const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

    // Hook que pega uma variavel que foi passada pela rota do navegador - similar ao PathVariable do back and
    const { id } = useParams<{ id: string }>()

    // useContext acessa nosso contexto, buscando dele as informações necessárias para esse Componente
    const { usuario, handleLogout } = useContext(AuthContext) // Gerenciar estados globais, que deve ser complartilhado com outros componentes.
    const token = usuario.token

    
    // Uma função assíncrona (async) que busca uma postagem específica por ID e trata possíveis erros durante a requisição - usada na atualização
    async function buscarPostagemPorId(id: string) { // Declara uma função assíncrona chamada buscarPostagemPorId que recebe um id como parâmetro.
        try {
            await buscar(`/postagens/${id}`, setPostagem, { //await buscar, Chama a função buscar, que faz uma requisição GET para o endpoint /postagens/${id} (buscando uma postagem específica pelo ID)
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            }
        }
    }

    // Função que chama a service buscar() para receber os dados de um Tema especifico 
    // Essa função é usada na hora de escolhermos o Tema que será relacionado com a Postagem
    async function buscarTemaPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            }
        }
    }

    // Função que chama a service buscar() para receber e guardar todos os temas cadastrado no Back and.
    async function buscarTemas() {
        try {
            await buscar('/temas', setTemas, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            }
        }
    }

    // Esse useEffect verifica se quando o usuário acessou esse componente, ele tem um token válido
    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado', "info");
            navigate('/');
        }
    }, [token])

    // Esse useEffect é responsavel por buscar os Temas e também, se o ID for diferente de undefined
    // pegar o ID da postagem e fazer uma busca no back-end em busca dos dados.
    useEffect(() => { // useEffect dispara buscarTemas, captura e tras todos os temas cadastrados.
        buscarTemas()

        if (id !== undefined) {
            buscarPostagemPorId(id)
        }
    }, [id])

    // Sempre que um Tema for escolhido, fazemos o relacionamento desse novo tema com a Postagem
    useEffect(() => {
        setPostagem({
            ...postagem,
            tema: tema,
        })
    }, [tema])

    // Função que pega os dados do Formulário e atualiza a Variavel de Estado Postagem
    // além de fazer o relacionamento entre Postagem, Tema e Usuario
    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
            tema: tema,
            usuario: usuario,
        });
    }

    // Função que envia o usuário para a rota de listagem de temas
    function retornar() {
        navigate('/postagens');
    }

    // Função que realiza o Cadastro ou Atualização de uma Postagem
    async function gerarNovaPostagem(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault() // Impede o Recarregamento do Formulário
        setIsLoading(true) // Atualiza a Variavel de Estado, indicando que existe uma carregamento ocorrendo

        // Esse IF verifica se vamos fazer uma atualização ou cadastro de uma Postagem
        if (id !== undefined) { // Se o ID existir é um processo de atualização
            try {
                await atualizar(`/postagens`, postagem, setPostagem, { // Chama a service de Atualizar
                    headers: {
                        Authorization: token,
                    },
                });

                ToastAlerta('Postagem atualizada com sucesso', "sucesso")

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    handleLogout()
                } else {
                    ToastAlerta('Erro ao atualizar a Postagem', "erro")
                }
            }

        } else { // Se o ID não existir é um processo de cadastro
            try {
                await cadastrar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                })

                ToastAlerta('Postagem cadastrada com sucesso', "sucesso");

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    handleLogout()
                } else {
                    ToastAlerta('Erro ao cadastrar a Postagem', "erro");
                }
            }
        }

        setIsLoading(false) // Atualiza a Variavel de Estado, indicando que o carregamento parou
        retornar() // Chama a função retornar()
    }

    // Estratégia que usamos para indicar que está ocorrendo um carregamento, mas na parte dos temas
    const carregandoTema = tema.descricao === '';

    return (
        <div className="container flex flex-col mx-auto items-center">
            <h1 className="text-4xl text-center my-8">
                {id !== undefined ? 'Editar Postagem' : 'Cadastrar Postagem'}
            </h1>

            <form className="flex flex-col w-1/2 gap-4" onSubmit={gerarNovaPostagem}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Título da Postagem</label>
                    <input
                        type="text"
                        placeholder="Titulo"
                        name="titulo"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.titulo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Texto da Postagem</label>
                    <input
                        type="text"
                        placeholder="Texto"
                        name="texto"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.texto}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p>Tema da Postagem</p>
                    <select name="tema" id="tema" className='border p-2 border-slate-800 rounded'
                        onChange={(e) => buscarTemaPorId(e.currentTarget.value)} // Quando um Tema é selecionado, buscamos as info daquele tema e guardamos na variavel de estado
                    >
                        <option value="" selected disabled>Selecione um Tema</option>

                        {temas.map((tema) => ( // Exibe cada Tema dentro de uma Tag Option dentro da Caixa de Seleção
                            <>
                                <option value={tema.id} >{tema.descricao}</option>
                            </>
                        ))}

                    </select>
                </div>
                <button
                    type='submit'
                    className='rounded disabled:bg-slate-200 bg-sky-400 hover:bg-sky-700
                               text-white font-bold w-1/2 mx-auto py-2 flex justify-center'
                    disabled={carregandoTema} // se a variavel estiver com o valor true, esse botão fica desativado, para impedir que a Postagem seja cadastrada sem um Tema
                    
                >
                    {isLoading ? // Se houver um carregamento, mostre um Loader
                        <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        /> :
                        // Se ÑÃO houver ID, o texto que aparece é Cadastrar, senão, o texto é Atualizar
                        <span>{id !== undefined ? 'Atualizar' : 'Cadastrar'}</span>
                    }
                </button>
            </form>
        </div>
    );
}

export default FormPostagem;