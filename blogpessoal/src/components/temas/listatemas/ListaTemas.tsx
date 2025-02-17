/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Desabilita algumas regras do ESLint:
// - `react-hooks/exhaustive-deps`: Impede que o ESLint exija dependências adicionais nos hooks useEffect.
// - `@typescript-eslint/no-explicit-any`: Permite o uso do tipo `any` sem avisos.

import { useContext, useEffect, useState } from "react";
import { DNA } from "react-loader-spinner"; // Importa um componente de loading animado
import { useNavigate } from "react-router-dom"; // Hook para navegação entre páginas
import { AuthContext } from "../../../contexts/AuthContext"; // Importa o contexto de autenticação
import Tema from "../../../models/Tema"; // Importa o modelo de dados Tema
import CardTemas from "../cardtemas/CardTemas"; // Importa o componente de card dos temas
import { buscar } from "../../../services/Service"; // Função de busca para API

function ListaTemas() {
    const navigate = useNavigate(); // Hook para redirecionamento de rotas

    // Estado que armazena os temas vindos da API
    const [temas, setTemas] = useState<Tema[]>([]);

    // Obtém as informações do usuário do contexto de autenticação
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token; // Obtém o token do usuário logado

    // Função assíncrona para buscar os temas da API
    async function buscarTemas() {
        try {
            await buscar('/temas', setTemas, {
                headers: { Authorization: token } // Envia o token no cabeçalho da requisição
            });
        } catch (error: any) {
            // Se o erro for um 403 (acesso não autorizado), faz o logout do usuário
            if (error.toString().includes('403')) {
                handleLogout();
            }
        }
    }

    // useEffect para verificar se o usuário está autenticado
    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado!'); // Exibe um alerta caso não tenha token
            navigate('/'); // Redireciona para a página inicial
        }
    }, [token]); // Executa sempre que o token mudar

    // useEffect para buscar os temas quando o componente for montado ou quando a quantidade de temas mudar
    useEffect(() => {
        buscarTemas();    
    }, [temas.length]); // Reexecuta sempre que a quantidade de temas mudar
    
    return (
        <>
            {/* Exibe o spinner de loading se a lista de temas ainda estiver vazia */}
            {temas.length === 0 && (
                <DNA
                    visible={true}
                    height="200"
                    width="200"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper mx-auto"
                />
            )}

            {/* Estrutura para exibir os temas */}
            <div className="flex justify-center w-full my-4">
                <div className="container flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Mapeia os temas recebidos e renderiza um CardTemas para cada um */}
                        {temas.map((tema) => (
                            <CardTemas key={tema.id} tema={tema} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListaTemas; // Exporta o componente para uso em outras partes do projeto
