/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Desabilita a regra do ESLint que acusa variáveis não utilizadas.

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Usuario from '../../models/Usuario'
import { cadastrarUsuario } from '../../services/Service'
import './Cadastro.css'
import { RotatingLines } from 'react-loader-spinner'

function Cadastro() {

  const navigate = useNavigate() // Hook para navegação entre páginas

  const [isLoading, setIsLoading] = useState<boolean>(false) // Estado para controlar o carregamento do botão

  const [confirmaSenha, setConfirmaSenha] = useState<string>("") // Estado para armazenar a confirmação da senha

  // Estado para armazenar os dados do usuário a ser cadastrado
  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: '',
    usuario: '',
    senha: '',
    foto: ''
  })
  
  // Efeito que verifica se o cadastro foi bem-sucedido (ID diferente de 0) e redireciona para login
  useEffect(() => {
    if (usuario.id !== 0){
      retornar()
    }
  }, [usuario])

  function retornar() {
    navigate('/login') // Redireciona para a página de login
  }

  // Atualiza o estado do usuário conforme os campos do formulário são preenchidos, de 1 ou mais caracteres, chamado em todos os imputs.
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    })
  }

  // Atualiza o estado da confirmação de senha
  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmaSenha(e.target.value)
  }

  // Função assíncrona que cadastra um novo usuário ao submeter o formulário
  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // Evita o comportamento padrão do formulário (recarregar a página)

    // Verifica se a senha e a confirmação de senha são iguais e se a senha tem pelo menos 8 caracteres
    if (confirmaSenha === usuario.senha && usuario.senha.length >= 8) {

      setIsLoading(true) // Ativa o carregamento

      try {
        // Faz a requisição para cadastrar o usuário e atualiza o estado
        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario)
        alert('Usuário cadastrado com sucesso!')
      } catch (error) {
        alert('Erro ao cadastrar o usuário!')
      }
    } else {
      alert('Dados do usuário inconsistentes! Verifique as informações do cadastro.')
      setUsuario({ ...usuario, senha: '' }) // Reseta a senha no estado
      setConfirmaSenha('') // Reseta a confirmação de senha
    }

    setIsLoading(false) // Finaliza o carregamento
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen 
            place-items-center font-bold">
        <div className="fundoCadastro hidden lg:block"></div>
        
        {/* Formulário de Cadastro */}
        <form className='flex justify-center items-center flex-col w-2/3 gap-3' 
          onSubmit={cadastrarNovoUsuario}>
          
          <h2 className='text-slate-900 text-5xl'>Cadastrar</h2>

          {/* Campo Nome */}
          <div className="flex flex-col w-full">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome"
              className="border-2 border-slate-700 rounded p-2"
              value={usuario.nome}
              onChange={atualizarEstado}
            />
          </div>

          {/* Campo Usuário */}
          <div className="flex flex-col w-full">
            <label htmlFor="usuario">Usuário</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Usuário"
              className="border-2 border-slate-700 rounded p-2"
              value={usuario.usuario}
              onChange={atualizarEstado}
            />
          </div>

          {/* Campo Foto */}
          <div className="flex flex-col w-full">
            <label htmlFor="foto">Foto</label>
            <input
              type="text"
              id="foto"
              name="foto"
              placeholder="Foto"
              className="border-2 border-slate-700 rounded p-2"
              value={usuario.foto}
              onChange={atualizarEstado}
            />
          </div>

          {/* Campo Senha */}
          <div className="flex flex-col w-full">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              className="border-2 border-slate-700 rounded p-2"
              value={usuario.senha}
              onChange={atualizarEstado}
            />
          </div>

          {/* Campo Confirmar Senha */}
          <div className="flex flex-col w-full">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              placeholder="Confirmar Senha"
              className="border-2 border-slate-700 rounded p-2"
              value={confirmaSenha}
              onChange={handleConfirmarSenha}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-around w-full gap-8">
            <button className='rounded text-white bg-red-400 
                  hover:bg-red-700 w-1/2 py-2' onClick={retornar}>
              Cancelar
            </button>

            <button 
                type='submit'
                className='rounded text-white bg-sky-400 
                           hover:bg-sky-700 w-1/2 py-2
                           flex justify-center'>
                  
              {/* Mostra o loader durante o carregamento */}
              {isLoading ? <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="24"
                visible={true}
              /> :
                <span>Cadastrar</span>
              }
              
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Cadastro
