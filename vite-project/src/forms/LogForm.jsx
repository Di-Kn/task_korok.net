import { useState } from 'react'

export function LogForm({text, textBtn, loginUser}){
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const onChangeLogin = (e)=>{
        setLogin(e.target.value)
    }
    const onChangePassword = (e)=>{
        setPassword(e.target.value)
    }

    const handleSubmit = (e)=>{
        e.preventDefault()

        const userData = {
            login: login,
            password: password,
        }

        loginUser(userData)

        setLogin('')
        setPassword('')

        console.log('Отправляем данные входа:', userData)
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

            <button type='submit'>
                {textBtn}
            </button>  
        </form>
    )
}