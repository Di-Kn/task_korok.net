import { useState } from 'react'

export function RegForm({text, textBtn, addUser}){
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [full_name, setFio] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateLogin = (value) => {
        const loginRegex = /^[a-zA-Z0-9]{6,}$/
        if (!loginRegex.test(value)) {
            return 'Логин должен содержать только латиницу и цифры, минимум 6 символов'
        }
        return ''
    }

    const validatePassword = (value) => {
        if (value.length < 8) {
            return 'Пароль должен содержать минимум 8 символов'
        }
        return ''
    }

    const validateFullName = (value) => {
        const fioRegex = /^[А-Яа-яЁё\s]+$/
        if (!fioRegex.test(value)) {
            return 'ФИО должно содержать только кириллицу и пробелы'
        }
        if (value.trim().split(/\s+/).length < 2) {
            return 'Введите полное ФИО (минимум 2 слова)'
        }
        return ''
    }

    const validatePhone = (value) => {
        const phoneRegex = /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/
        if (!phoneRegex.test(value)) {
            return 'Телефон должен быть в формате 8(XXX)XXX-XX-XX'
        }
        return ''
    }

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
            return 'Введите корректный email адрес'
        }
        return ''
    }

    const validateField = (field, value) => {
        let error = ''
        switch(field) {
            case 'login':
                error = validateLogin(value)
                break
            case 'password':
                error = validatePassword(value)
                break
            case 'full_name':
                error = validateFullName(value)
                break
            case 'phone':
                error = validatePhone(value)
                break
            case 'email':
                error = validateEmail(value)
                break
            default:
                break
        }
        setErrors(prev => ({...prev, [field]: error}))
        return error
    }

    const onChangeLogin = (e) => {
        const value = e.target.value
        setLogin(value)
        validateField('login', value)
    }

    const onChangePassword = (e) => {
        const value = e.target.value
        setPassword(value)
        validateField('password', value)
    }

    const onChangeFio = (e) => {
        const value = e.target.value
        setFio(value)
        validateField('full_name', value)
    }

    const onChangePhone = (e) => {
        const value = e.target.value
        setPhone(value)
        validateField('phone', value)
    }

    const onChangeEmail = (e) => {
        const value = e.target.value
        setEmail(value)
        validateField('email', value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const loginError = validateLogin(login)
        const passwordError = validatePassword(password)
        const fioError = validateFullName(full_name)
        const phoneError = validatePhone(phone)
        const emailError = validateEmail(email)

        const newErrors = {
            login: loginError,
            password: passwordError,
            full_name: fioError,
            phone: phoneError,
            email: emailError
        }

        setErrors(newErrors)

        const hasErrors = Object.values(newErrors).some(error => error !== '')
        
        if (hasErrors) {
            setIsSubmitting(false)
            alert('Пожалуйста, исправьте ошибки в форме')
            return
        }

        const objectUser = {
            login: login.trim(),
            password: password.trim(),
            full_name: full_name.trim(),
            phone: phone.trim(),
            email: email.trim()
        }

        try {
            await addUser(objectUser)
            setLogin('')
            setPassword('')
            setFio('')
            setPhone('')
            setEmail('')
            setErrors({})
        } catch (error) {
            console.error('Ошибка при регистрации:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, '')
        if (digits.length === 0) return ''
        if (digits.length <= 1) return `8(${digits}`
        if (digits.length <= 4) return `8(${digits.slice(1)}`
        if (digits.length <= 7) return `8(${digits.slice(1,4)})${digits.slice(4)}`
        if (digits.length <= 9) return `8(${digits.slice(1,4)})${digits.slice(4,7)}-${digits.slice(7)}`
        return `8(${digits.slice(1,4)})${digits.slice(4,7)}-${digits.slice(7,9)}-${digits.slice(9,11)}`
    }

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value)
        setPhone(formatted)
        validateField('phone', formatted)
    }

    return(
        <form onSubmit={handleSubmit}>
            <h2>{text}</h2>
            
            <div>
                <input
                    type='text'
                    value={login}
                    placeholder='Login (латиница, минимум 6 символов)'
                    onChange={onChangeLogin}
                    required
                    disabled={isSubmitting}
                />
                {errors.login && <span>{errors.login}</span>}
            </div>

            <div>
                <input
                    type='password'
                    value={password}
                    placeholder='Password (минимум 8 символов)'
                    onChange={onChangePassword}
                    required
                    disabled={isSubmitting}
                />
                {errors.password && <span>{errors.password}</span>}
            </div>

            <div>
                <input
                    type='text'
                    value={full_name}
                    placeholder='Full Name (кириллица)'
                    onChange={onChangeFio}
                    required
                    disabled={isSubmitting}
                />
                {errors.full_name && <span>{errors.full_name}</span>}
            </div>

            <div>
                <input
                    type='tel'
                    value={phone}
                    placeholder='Phone: 8(XXX)XXX-XX-XX'
                    onChange={handlePhoneChange}
                    required
                    disabled={isSubmitting}
                />
                {errors.phone && <span>{errors.phone}</span>}
            </div>

            <div>
                <input
                    type='email'
                    value={email}
                    placeholder='Email'
                    onChange={onChangeEmail}
                    required
                    disabled={isSubmitting}
                />
                {errors.email && <span>{errors.email}</span>}
            </div>

            <button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : textBtn}
            </button>
        </form>
    )
}