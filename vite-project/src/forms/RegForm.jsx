import { useState } from 'react'

export function RegForm({text, textBtn, addUser}){
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [full_name, setFio] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')

    const onChangeLogin = (e)=>{
        setLogin(e.target.value)
    }
    const onChangePassword = (e)=>{
        setPassword(e.target.value)
    }
    const onChangeFio = (e)=>{
        setFio(e.target.value)
    }
    const onChangePhone = (e)=>{
        setPhone(e.target.value)
    }
    const onChangeEmail = (e)=>{
        setEmail(e.target.value)
    }

    const handleSubmit = (e)=>{
        e.preventDefault()

        const objectUser = {
            login: login,
            password: password,
            full_name: full_name,
            phone: phone,
            email: email
        }

        addUser(objectUser)

        setLogin('')
        setPassword('')
        setFio('')
        setPhone('')
        setEmail('')

        console.log('Отправляем данные регистрации:', objectUser)
    }

    return(
        <form onSubmit={handleSubmit}>
            <h2>{text}</h2>
            <input
                type='text'
                value={login}
                placeholder='Login'
                onChange={onChangeLogin}
                required
            />

            <input
                type='password'
                value={password}
                placeholder='Password'
                onChange={onChangePassword}
                required
            />

            <input
                type='text'
                value={full_name}
                placeholder='Full Name'
                onChange={onChangeFio}
                required
            />

            <input
                type='tel'
                value={phone}
                placeholder='Phone'
                onChange={onChangePhone}
                required
            />

            <input
                type='email'
                value={email}
                placeholder='Email'
                onChange={onChangeEmail}
                required
            /> 

            <button type='submit'>
                {textBtn}
            </button>  
        </form>
    )
}