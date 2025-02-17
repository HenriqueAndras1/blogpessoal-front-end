/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from 'react-router-dom';  // Importa o Link para navegação entre páginas e useNavigate para navegação programática.
import './Login.css';  // Importa o arquivo de estilos CSS específico para a página de login.
import { AuthContext } from '../../contexts/AuthContext';  // Importa o contexto de autenticação, onde serão consumidas as informações de login.
import { ChangeEvent, useContext, useEffect, useState } from 'react';  // Importa hooks e tipos do React, como useState, useEffect, useContext e ChangeEvent.
import UsuarioLogin from '../../models/UsuarioLogin';  // Importa o modelo de dados do usuário, que inclui informações de login.
import { RotatingLines } from 'react-loader-spinner';  // Importa um spinner (animação de carregamento) para ser mostrado enquanto o login está sendo processado.

function Login() {

    const navigate = useNavigate();  // Inicializa a função 'navigate' para permitir navegação entre páginas programaticamente.

    // Consome o contexto de autenticação (AuthContext) para acessar informações sobre o usuário, funções de login e estado de carregamento.
    const { usuario, handleLogin, isLoading } = useContext(AuthContext)

    // Cria um estado local 'usuarioLogin' para armazenar os dados do usuário que está tentando fazer login.
    const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>(
        {} as UsuarioLogin  // Inicializa com um objeto vazio, com tipo UsuarioLogin.
    )

    // useEffect para redirecionar o usuário para a página 'home' se ele já estiver autenticado (se o token não estiver vazio).
    useEffect(() => {
        if (usuario.token !== "") {  // Verifica se o usuário já tem um token de autenticação.
            navigate('/home')  // Se já tiver um token, redireciona para a página inicial 'home'.
        }
    }, [usuario])  // O efeito é executado toda vez que o estado 'usuario' é alterado.

    // Função para atualizar o estado 'usuarioLogin' com base nas mudanças nos campos do formulário.
    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setUsuarioLogin({
            ...usuarioLogin,  /* Mantém os outros valores no estado (não altera os que não foram modificados). dessa forma id: 
            nome: 
            usuario: 
            senha: 
            foto: 
            token: */

            [e.target.name]: e.target.value  // Atualiza o campo específico "input"(por exemplo, 'usuario' ou 'senha').
            /*"target"=> "puxa do input name" => usuario: "value" => root@root.com
            e "input senha" senha: "value 12345678" */
        })
    }

    // Função para tratar o envio do formulário de login. Impede o comportamento padrão de recarregar a página.
    function login(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()  // Impede que o formulário seja enviado de forma tradicional (o que recarregaria a página).
        handleLogin(usuarioLogin)  // Chama a função 'handleLogin' para autenticar o usuário com os dados preenchidos.
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 
                    h-screen place-items-center font-bold ">
                {/* O formulário de login é exibido em uma grid responsiva, que ocupa toda a altura da tela. */}
                <form className="flex justify-center items-center flex-col w-1/2 gap-4"
                    onSubmit={login}>  {/* O evento 'onSubmit' chama a função 'login' quando o formulário é enviado. */}
                    <h2 className="text-slate-900 text-5xl ">Entrar</h2>  {/* Título da página de login. */}
                    
                    {/* Campo para o nome de usuário */}
                    <div className="flex flex-col w-full">
                        <label htmlFor="usuario">Usuário</label>
                        <input
                            type="text"
                            id="usuario"
                            name="usuario"
                            placeholder="Usuario"
                            className="border-2 border-slate-700 rounded p-2"
                            value={usuarioLogin.usuario}  // O valor do input é controlado pelo estado 'usuarioLogin'.
                            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}  // Atualiza o estado quando o usuário digita no campo.
                        />
                    </div>

                    {/* Campo para a senha */}
                    <div className="flex flex-col w-full">
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            placeholder="Senha"
                            className="border-2 border-slate-700 rounded p-2"
                            value={usuarioLogin.senha}  // O valor do input é controlado pelo estado 'usuarioLogin'.
                            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}  // Atualiza o estado quando o usuário digita no campo.
                        />
                    </div>

                    {/* Botão de login */}
                    <button
                        type='submit'
                        className="rounded bg-sky-400 flex justify-center
                                   hover:bg-sky-700 text-white w-1/2 py-2">
                        {/* Se o login estiver carregando, exibe o spinner, caso contrário, exibe o texto 'Entrar'. */}
                        {isLoading ? <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        /> :
                            <span>Entrar</span>
                        }
                    </button>

                    <hr className="border-slate-800 w-full" />  {/* Linha de separação entre o formulário e o link de cadastro. */}

                    <p>
                        Ainda não tem uma conta?{' '}
                        <Link to="/cadastro" className="text-indigo-800 hover:underline">
                            Cadastre-se  {/* Link para a página de cadastro, onde o usuário pode criar uma nova conta. */}
                        </Link>
                    </p>
                </form>
                {/* Esta div é uma parte do layout, que pode exibir uma imagem de fundo ou outro conteúdo visual, mas fica oculta em telas pequenas. */}
                <div className="fundoLogin hidden lg:block"></div>
            </div>
        </>
    );
}

export default Login;  // Exporta o componente Login para ser utilizado em outras partes da aplicação.
