'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar/Navbar'
import '../auth.css'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import logo from '@/assets/Blog.png'

interface FormData {
    email: string
    password: string
}

export default function Signin() {
    const router = useRouter()

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const validationErrors: Record<string, string> = {}
        if (!formData.email) validationErrors.email = 'Email is required'
        if (!formData.password) validationErrors.password = 'Password is required'

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                }
            )

            const data = await res.json()

            if (data.ok) {
                toast.success(data.message, { autoClose: 2000 })
                // redirect using Next.js router
                router.push('/')
            } else {
                toast.error(data.message, { autoClose: 2000 })
            }
        } catch (err: any) {
            toast.error(err.message, { autoClose: 2000 })
        }
    }

    return (
        <div className='authout'>
            <Navbar />
            <div className='authin'>
                <div className='left'>
                    <Image src={logo} alt='' className='img' />
                </div>
                <div className='right'>
                    <form
                        style={{ display: 'flex', flexDirection: 'column' }}
                        onSubmit={handleSubmit}
                    >
                        <div className='forminput_cont'>
                            <label>Email</label>
                            <input
                                type='text'
                                placeholder='Enter Your Email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <span className='formerror'>{errors.email}</span>
                            )}
                        </div>
                        <div className='forminput_cont'>
                            <label>Password</label>
                            <input
                                type='password'
                                placeholder='Enter Your Password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <span className='formerror'>{errors.password}</span>
                            )}
                        </div>

                        <button type='submit' className='main_button'>
                            Login
                        </button>

                        <p className='authlink'>
                            Do not have an account?{' '}
                            <Link href='/pages/auth/signup'>Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
