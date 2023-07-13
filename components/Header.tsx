'use client'

import LayerSwapLogo from './icons/layerswapExplorer'
import Search from './Search'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import LayerswapLogo from './icons/layerswapLogo'
import { FileText } from 'lucide-react'

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="max-w-6xl w-full mx-auto">
            <nav className={`mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-6 lg:grid-rows-1 items-center py-6 px-6 lg:px-8 ${pathname !== '/' ? 'grid-rows-2' : 'grid-rows-1'}`} aria-label="Global">
                <Link href="/" className="-m-1.5 p-1.5 order-1 col-span-1">
                    <LayerSwapLogo className="h-14 w-auto text-primary-logoColor" />
                </Link>
                <div className='max-w-2xl w-full  mx-auto order-3 lg:order-2 col-span-4'>
                    {pathname !== '/' &&
                        <Search hideLabel />
                    }
                </div>
                <div className="flex gap-x-4 order-2 lg:order-3 justify-self-end col-span-1">
                    <Link target='_blank' href={'https://www.layerswap.io/app'} className='px-3 py-2 bg-secondary-700 rounded-lg hover:bg-secondary/70'>
                        <LayerswapLogo className='h-6 w-auto text-primary-logoColor' />
                    </Link>
                    <Link target='_blank' href={'https://docs.layerswap.io'} className='px-3 py-2 bg-secondary-700 rounded-lg flex items-center gap-1 text-white hover:bg-secondary/70'>
                        <FileText className='h-4 w-4' />
                        <span>Docs</span>
                    </Link>
                </div>
            </nav>
        </header>
    )
}