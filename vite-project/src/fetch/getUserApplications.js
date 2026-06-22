export async function getUserApplications(id) {
    try {
        let response = await fetch(`http://localhost:3000/applications/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        return await response.json()
    } catch (error) {
        console.error('Ошибка:', error)
        throw error
    }
}