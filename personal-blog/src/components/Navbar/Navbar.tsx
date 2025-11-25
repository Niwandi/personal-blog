'use client'
import React, { useState, useEffect } from 'react'
import { BiPlus, BiSearchAlt, BiSolidUserCircle } from 'react-icons/bi'
import Link from 'next/link'
import logo from '@/assets/Logo.png'
import Image from 'next/image'
import './Navbar.css'
import { toast } from 'react-toastify'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const router = useRouter()
    const [auth, setauth] = useState<boolean>(false)

    useEffect(() => {
    const checkLogin = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                }
            )
            const data = await res.json()

            // Update state inside the async flow, not synchronously
            setauth(data.ok === true)
        } catch (err: any) {
            toast.error(err.message, { autoClose: 2000 })
            setauth(false)
        }
    }

    checkLogin() // call the async function
}, [])


    const handlelogout = async () => {
        await deleteCookie('authToken')
        await deleteCookie('refreshToken')
        router.push('/pages/auth/signin')
    }

    return (
        <nav className='navbar'>
            <div className='navbar-left'>
                <Link href='/pages/profile' className='link'>
                    <BiSolidUserCircle className='icon' />
                </Link>
                <Link href='/pages/addblog'>
                    <BiPlus className='icon' />
                </Link>
                <Link href='/search'>
                    <BiSearchAlt className='icon' />
                </Link>
            </div>
            <div className='navbar-middle'>
                <Link href='/'>
                    <Image className='logo' src={logo} alt='Logo' />
                </Link>
            </div>
            {auth ? (
                <div className='navbar-right'>
                    <Link href='/'>Home</Link>
                    <Link href='/pages/about'>About</Link>
                    <Link href='/pages/contact'>Contact</Link>

                    <button onClick={handlelogout}>Logout</button>
                </div>
            ) : (
                <div className='navbar-right'>
                    <Link href='/pages/auth/signin'>
                        <button>Login</button>
                    </Link>
                    <Link href='/pages/auth/signup'>
                        <button>Signup</button>
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar
