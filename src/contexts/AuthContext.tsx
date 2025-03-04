/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, ReactNode, useState } from "react"  // Importa funções essenciais do React, como o createContext e useState, além de tipos como ReactNode.
import UsuarioLogin from "../models/UsuarioLogin"  // Importa o tipo ou modelo do usuário (dados de login).
import { login } from "../services/Service"  // Importa a função de login, que se comunica com o serviço de autenticação.
import { ToastAlerta } from "../utils/ToastAlerta"

interface AuthContextProps {
    usuario: UsuarioLogin  // Representa o estado do usuário autenticado, conforme o modelo UsuarioLogin.
    handleLogout(): void  // Função que lida com o logout do usuário.
    handleLogin(usuario: UsuarioLogin): Promise<void>  // Função assíncrona para realizar o login do usuário.
    isLoading: boolean  // Estado para indicar se o processo de login está carregando.
}

interface AuthProviderProps {
    children: ReactNode  // Define que o componente AuthProvider recebe filhos que são componentes React (qualquer conteúdo renderizável).
}

export const AuthContext = createContext({} as AuthContextProps)  // Cria o contexto de autenticação, que fornecerá o estado de autenticação para os filhos.

export function AuthProvider({ children }: AuthProviderProps) {  // Componente AuthProvider que irá envolver a aplicação para fornecer o contexto de autenticação.
    
    // Inicializa o estado 'usuario' com um valor padrão (usuário não autenticado).
    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: "",
        usuario: "",
        senha: "",
        foto: "",
        token: ""
    })

    // Inicializa o estado 'isLoading' para controlar o estado de carregamento durante o login.
    const [isLoading, setIsLoading] = useState(false)

    // Função assíncrona que tenta autenticar o usuário.
    async function handleLogin(usuarioLogin: UsuarioLogin) {
        setIsLoading(true)  // Define o estado de carregamento como verdadeiro, para indicar que o login está em andamento.
        try {
            // Chama a função 'login' do serviço, passando a URL da API e os dados do usuário. Caso o login seja bem-sucedido, o estado do usuário é atualizado.
            await login(`/usuarios/logar`, usuarioLogin, setUsuario)
            ToastAlerta("Login efeituado com sucesso!", "sucesso")  // Exibe uma mensagem de sucesso ao usuário.
        } catch (error) {
            // Caso haja um erro no login, exibe uma mensagem de erro.
            ToastAlerta("Os dados do Usuário estão inconsistentes!", "erro")
        }
        setIsLoading(false)  // Define o estado de carregamento como falso após o processo de login, seja com sucesso ou erro.
    }

    // Função para realizar o logout, limpando o estado do usuário.
    function handleLogout() {
        setUsuario({
            id: 0,
            nome: "",
            usuario: "",
            senha: "",
            foto: "",
            token: ""
        })  // Reseta o estado do usuário para um objeto vazio, simulando o logout.
    }

    // O AuthContext.Provider vai envolver os componentes filhos, fornecendo o estado e as funções de login e logout para os filhos.
    return (
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
            {children}  {/* Renderiza os filhos do AuthProvider */}
        </AuthContext.Provider>
    )
}

//O AuthContext é um contexto do React que gerencia a autenticação do usuário em toda a aplicação. Ele armazena informações como o token de autenticação, dados do usuário e funções para login e logout, permitindo que qualquer componente tenha acesso a essas informações sem precisar repassá-las manualmente via props.