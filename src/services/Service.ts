/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import axios from "axios";

// Configuração da instância do Axios com a base URL da API
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // Define o endpoint base para as requisições
})

/**
 * Função para cadastrar um usuário na API.
 * 
 * @param url - Endpoint da API para cadastro do usuário.
 * @param dados - Objeto contendo os dados do usuário a ser cadastrado.
 * @param setDados - Função que será chamada para atualizar o estado com a resposta da API.
 */
export const cadastrarUsuario = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados) // Envia os dados para a API via método POST
    setDados(resposta.data) // Atualiza o estado com a resposta da API
}

/**
 * Função para realizar login do usuário na API.
 * 
 * @param url - Endpoint da API para login.
 * @param dados - Objeto contendo as credenciais do usuário.
 * @param setDados - Função que será chamada para armazenar a resposta da API (ex: token de autenticação).
 */
export const login = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados) // Envia as credenciais para a API via método POST
    setDados(resposta.data) // Atualiza o estado com a resposta da API
}

export const buscar = async (url: string, setDados: Function, header: Object) => {
    const resposta = await api.get(url, header)
    setDados(resposta.data)
}

// adicionado header onde é passado o token.
export const cadastrar = async (url: string, dados: Object, setDados: Function, header: Object) => {
    const resposta = await api.post(url, dados, header)
    setDados(resposta.data)
}

export const atualizar = async (url: string, dados: Object, setDados: Function, header: Object) => {
    const resposta = await api.put(url, dados, header)
    setDados(resposta.data)
}

export const deletar = async (url: string, header: Object) => {
    await api.delete(url, header)
}

// service é responsável por gerenciar as requisições de autenticação e cadastro de usuários no site. Ela se comunica com a API do blog pessoal, enviando os dados dos usuários para cadastro e login, e armazenando a resposta recebida. Dessa forma, facilita a interação entre o frontend e o backend, garantindo que os usuários possam se registrar e acessar a plataforma corretamente, e obter uma resposta se deu certo a conexão ou não.