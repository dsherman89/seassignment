document.addEventListener('DOMContentLoaded', function(){
    const content = document.getElementById('consent');

    content.innerHTML =
    
        `<form id="loginForm">
            <input type="text" id="username" placeholder="Username" required />
            <input type="password" id="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>`

    document.getElementById('loginForm').addEventListener('submit', function(e){
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })


        
        .then(response => response.json())
        .then(data => {
            if(data.auth){
                // happy path
                console.log('Logged in:', data.token);
            } else {
                // sad path
                console.log('Login failed');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });