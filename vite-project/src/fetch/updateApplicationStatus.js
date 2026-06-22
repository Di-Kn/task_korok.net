export async function updateApplicationStatus(appId, newStatus) {
    try {
        let response = await fetch(`http://localhost:3000/admin/applications/${appId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ status: newStatus })
        })
        return await response.json()
    } catch (error) {
        console.error('Ошибка:', error)
        return { success: false, error: error.message }
    }
}