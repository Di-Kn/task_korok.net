export async function sendApplication(applicationData) {
    try {
        let response = await fetch('http://localhost:3000/application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(applicationData)
        })
        
        return await response.json()
    } catch (error) {
        console.error('Ошибка:', error)
        return { success: false, error: error.message }
    }
}