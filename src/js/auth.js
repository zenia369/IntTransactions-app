const btnAuth = document.getElementById('btn-auth');
const emailText = document.getElementById('email');
const passwordText = document.getElementById('password');
const checkbox = document.getElementById('checkbox');


window.addEventListener('load', async () => {
    const value = getFromLocalStorage();

    if(Object.keys(value).length) {
        emailText.value = value.email;
        passwordText.value = value.password;
        checkbox.checked = true
    }

    if(navigator.serviceWorker) {
        try {
            await navigator.serviceWorker.register('../../sw.js')
            console.log('ServiseWorker register is success')
        } catch (error) {
            console.log('ServiseWorker register is fail')
            console.log('Error in auth-Load:', error)
        }
    }
     

   
})

btnAuth.addEventListener('click', authClient);

function authClient(e) { //поле авторизація
    e.preventDefault();

    const data = {
                email: emailText.value,
                password: passwordText.value
            }
            

    if(checkbox.checked) {
        addToLocalStorage(data)
    }
    if(emailText.value && passwordText.value && checkLoad()) {
        request('/api/auth', data, "POST").then(res => {
            if(res.message) {
                changeMessage(res.message);
            } else {
                addContent(res.body);
                addSRC(res.src);
                userStatus(res.statusName);
            }

        }) 
    }

}

function addToLocalStorage(keyArr) {
    localStorage.setItem('keyArr', JSON.stringify(keyArr));
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('keyArr') || '[]')
}

//add response to body
function addContent(data) {
    const main = document.getElementById('main');
    if(data) {
        const messageError = document.getElementById('error');
        messageError.style.display = 'none';
        const element = document.createElement('div');
        element.id = 'load'
        element.innerHTML = `${data}`;
    
        main.appendChild(element);

    }
}
//add src to body 
function addSRC(src) {
    const script = document.createElement('script');
    script.src = src;
    document.querySelector('.container').appendChild(script)
}
//add user name status
function userStatus(name) {
    document.getElementById('menu__active-mode').innerHTML = `${name}`
}
function changeMessage(name) {
    document.getElementById('message').innerHTML = `${name}`
}

//checkLoad
function checkLoad() {
    return document.getElementById('load')? false : true
}

// FETCH
async function request(url, data = null, method = 'GET') {
    try {
        const headers = {};
        let body

        if (data) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        const response = await fetch(url, {
            method,
            headers,
            body,
        })
        return await response.json();
    } catch (error) {
        console.warn('Error:', error.message);
    }
}