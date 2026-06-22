export async function logUser(loginUser) {
    try {
        let response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(loginUser)
        })
        return await response.json()
    } catch (error) {
        console.error('Ошибка:', error)
        return { success: false, error: error.message }
    }
}