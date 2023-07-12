'use client'

import { useState } from 'react'
import LayerSwapLogo from './icons/layerSwapLogo'
import Search from './Search'
import { usePathname } from 'next/navigation'
import BackBtn from '@/helpers/BackButton'
import Link from 'next/link'

const navigation = [
    { name: 'App', href: 'https://layerswap.io' },
    { name: 'Docs', href: 'https://docs.layerswap.io' },
]

export default function Header() {
    const pathname = usePathname()

    return (
        <header className="max-w-6xl w-full mx-auto">
            {pathname !== '/' && <div className='hidden xl:block absolute left-4 top-4 md:left-8 md:top-8 hover:bg-secondary-600 hover:text-accent-foreground rounded ring-offset-background transition-colors'>
                <BackBtn />
            </div>}
            <nav className={`mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-6 lg:grid-rows-1 items-center py-6 px-6 lg:px-8 ${pathname !== '/' ? 'grid-rows-2' : 'grid-rows-1'}`} aria-label="Global">
                <Link href="/" className="-m-1.5 p-1.5 order-1 col-span-1">
                    <LayerSwapLogo className="h-14 w-auto text-primary-logoColor" />
                </Link>
                <div className='max-w-2xl w-full  mx-auto order-3 lg:order-2 col-span-4'>
                    {pathname !== '/' &&
                        <Search hideLabel />
                    }
                </div>
                <div className="flex gap-x-5 lg:gap-x-12 order-2 lg:order-3 justify-self-end col-span-1">
                    {navigation.map((item) => (
                        <Link target='_blank' key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-all duration-200">
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    )
}