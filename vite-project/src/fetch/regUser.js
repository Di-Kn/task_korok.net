export async function regUser(userData){
let response = await fetch('http://localhost:3000/regUser', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(userData)
});

return await response.json();
}