// Importa o componente Link do 'react-router-dom' para navegação entre páginas sem recarregar a aplicação
import { Link } from 'react-router-dom'
import Tema from '../../../models/Tema'

interface CardTemasProps{
    tema: Tema
}

// Define o componente funcional CardTemas
function CardTemas({ tema }: CardTemasProps) {
    return (
        // Div principal do card com bordas arredondadas, layout flexível e divisão vertical dos elementos
        <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>

            {/* Cabeçalho do card com fundo roxo escuro, texto branco e estilização da fonte */}
            <header className='py-2 px-6 bg-sky-400 text-white font-bold text-2xl'>
                Tema
            </header>

            {/* Parágrafo representando a descrição do tema com fundo cinza claro e tamanho de texto grande */}
            <p className='p-8 text-3xl bg-slate-200 h-full'>{tema.descricao}</p>
            
            {/* Div que contém os botões de ação (Editar e Deletar) */}
            <div className="flex">

                {/* Link para edição, estilizado com fundo azul claro e efeito de hover escurecendo */}
                <Link to={`/editartema/${tema.id}`}
	className='w-full text-slate-100 bg-sky-400 hover:bg-sky-700 
    flex items-center justify-center py-2'>
	<button>Editar</button>
</Link>

                {/* Link para deletar, estilizado com fundo vermelho e hover escurecendo */}
                <Link to={`/deletartema/${tema.id}`} 
	className='text-slate-100 bg-red-600 hover:bg-red-700 w-full 
		flex items-center justify-center'>
	<button>Deletar</button>
</Link>
            </div>

        </div>
    )
}

// Exporta o componente para ser utilizado em outros arquivos do projeto
export default CardTemas
