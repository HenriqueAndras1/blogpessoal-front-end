import Popup from 'reactjs-popup';
import FormPostagem from '../formpostagem/FormPostagem';

import 'reactjs-popup/dist/index.css';
import './ModalPostagem.css'

function ModalPostagem() {
    return (
        <>
            <Popup
                // trigger, no Componente Popup, que funciona como um gatilho, que por meio de um botão, irá abrir o nosso Modal
                trigger={
                    <button 
                        className='border rounded px-4 py-2 hover:bg-white hover:text-sky-800'>
                        Nova Postagem
                    </button>
                }
                modal
            >
                <FormPostagem />
            </Popup>
        </>
    );
}

export default ModalPostagem;