/* eslint-disable prefer-const */
import { FacebookLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react'
import { ReactNode, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

function Footer() {
    let data = new Date().getFullYear()
    const { usuario } = useContext(AuthContext)
    let component: ReactNode

    if (usuario.token !== "") {
        component = (
            <div className="flex justify-center bg-sky-400 text-white">
                <div className="container flex flex-col items-center py-4">
                    <p className='text-xl font-bold'>
                        BlogNet | Copyright: {data}
                    </p>
                    <p className='text-lg'>Acesse nossas redes sociais</p>
                    
                    {/* Container flex para alinhar os ícones lado a lado */}
                    <div className='flex gap-4 mt-2'>
                        <a href="https://www.linkedin.com/school/generationbrasil" target="_blank" className='hover:opacity-75'>
                            <LinkedinLogo size={48} weight='bold' />
                        </a>
                        <a href="https://www.instagram.com/generationbrasil" target="_blank" className='hover:opacity-75'>
                            <InstagramLogo size={48} weight='bold' />
                        </a>
                        <a href="https://www.facebook.com/generationbrasil" target="_blank" className='hover:opacity-75'>
                            <FacebookLogo size={48} weight='bold' />
                        </a>
                    </div>
                </div>
            </div>
        )
    }
    return <>{component}</>
}

export default Footer
