export async function getAllApplications() {
    try {
        let response = await fetch('http://localhost:3000/admin/applications', {
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