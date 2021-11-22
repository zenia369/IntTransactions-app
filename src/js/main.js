// Р-Касир
const createTrn = document.querySelector('.main__options-paymaster-one');
const seeChangeTrn = document.querySelector('.main__options-paymaster-two');
const viewContentOne = document.querySelector('.main__content-paymaster-form');
const viewContentTwo = document.querySelector('.main__content-paymaster-list');
const listNames = document.querySelector('.list-names');
const inputSum = document.querySelector('.input-suma-place');
const placeOutput = document.getElementById('currenValue1');
const btn = document.getElementById('btn-create');



createTrn.addEventListener('click', content);
seeChangeTrn.addEventListener('click', () => content(false));
btn.addEventListener('click', createForm);
inputSum.addEventListener('change', (e) => {
    changeBeforeSum(e.target.value)
})
createListName(); // create list options
loadListChanges(); // fetch for list



function content(key = true) {
    if(key) {
        createTrn.classList.toggle('btn-click');
        seeChangeTrn.classList.toggle('btn-click');
        viewContentOne.classList.remove('main-content-active');
        viewContentTwo.classList.add('main-content-active');
    } else {
        seeChangeTrn.classList.toggle('btn-click');
        createTrn.classList.toggle('btn-click');
        viewContentTwo.classList.remove('main-content-active');
        viewContentOne.classList.add('main-content-active');
    }
}

//створення листа назв рахунків

function createListName() {
    //запрос на бек для отримання списку
    request('/api/PM/scoreOption', null, "POST").then(res => {
        console.log(listNames.childNodes[3], listNames.childNodes[4]);


        if(listNames.childNodes[4] && listNames.childNodes[3]) {
            listNames.removeChild(listNames.childNodes[3])
            listNames.removeChild(listNames.childNodes[3])
        }

        res.map(el => {
            const item = document.createElement('option');
            item.innerHTML = `<option>${el.name}</option>`;
            listNames.appendChild(item);
        })

        return res
    }).then(el => {
        listNames.addEventListener('click', (e) => { //слухач на інпут суми
            changeValue(e.target.value, el)
        })
    })



}

//подія на вибір назви  та заповнення стану рахунку
function changeValue(key,score) {
    score.forEach(el => {
        if(el.name === key) {
            placeOutput.innerHTML = el.value;
        }
    });
}
//подія на створення різниці суми що ввели і існуючого рахунку 
function changeBeforeSum(key) {

    const sum = document.getElementById('currenValue1').innerHTML;
    const form2 = document.getElementById('form-2').value;
    let placeSumOutput = document.getElementById('currenValue2');

    if(key === 'витрата' && sum) {
        placeSumOutput.innerHTML = Number(sum) - Number(form2) >= 0? Number(sum) - Number(form2) : 'Помилка';
    } else if(key === 'прихід') {
        placeSumOutput.innerHTML = Number(sum) + Number(form2) >= 0? Number(sum) + Number(form2): 'Помилка';
    }
 
}




// solo-components
const time = document.getElementById('time');
function getTime() {
    let value = `${new Date().getFullYear()}.${new Date().getMonth()+1}.${new Date().getDate()} - ${new Date().getHours()}:${new Date().getUTCMinutes()<10 ? '0' + new Date().getUTCMinutes() : new Date().getUTCMinutes()}`
    return value;
}
setInterval(()=> {
    time.innerHTML = getTime()
},1000)


function reactAnimation() { //animation reaction
    const reaction = document.querySelector('.reaction');

    reaction.classList.remove('reaction--disabled');
    reaction.classList.add('reaction--active');
    setTimeout(() => {
        reaction.classList.remove('reaction--active');
        reaction.classList.add('reaction--disabled');
    }, 5000)

}


//send Form
function createForm(event) {
    const form1 = document.getElementById('form-1');
    const form2 = document.getElementById('form-2');
    const form3 = document.getElementById('form-3');
    const form4 = document.getElementById('form-4');
    const time = document.getElementById('time').innerHTML;

    const data = {
        name: form1.value,
        value: form2.value,
        rout: form3.value,
        text: "" || form4.value,
        time: time
    }


    if(data.name !== "" && data.value !== "" && data.rout !== "") {
        event.preventDefault();
        event.target.disabled = true;

        request('/api/PM/saveTr', data, 'POST')
            .then(res => res? document.getElementById('reaction__in').innerHTML = "Створено" : document.getElementById('reaction__in').innerHTML = "Помилка")
            .then(() => reactAnimation())
            .then(() => {
                form1.value = '';
                form2.value = '';
                form3.value = '';
                form4.value = '';
                document.getElementById('currenValue1').innerHTML = '';
                document.getElementById('currenValue2').innerHTML = '';
            })
            .then(() => createListName())
            .then(() =>  event.target.disabled = false)
    }
}

//fetch for list changes

// setInterval(() => {
//     loadListChanges()
// }, 10000);
function loadListChanges() {
    request('/api/PM/list', null, 'POST')
        .then(res => res.length > 0 ?
            res.map(el => createLi(el)).join('')
            : document.querySelector('.main__content-paymaster-list__ul').innerHTML = '<p style="text-align: center;">Пусто</p>')
        .then(res => document.querySelector('.main__content-paymaster-list__ul').innerHTML = res)
}
function createLi(item) {
    return `
        <li class="main__content-paymaster-list__ul-item">
            <p style="margin-left: 5px;">Назва рахунку -- ${item.name}</p>
            <div style="border-top: 1px solid #CCC; margin: 5px; padding: 5px;">
                <p>Хто -- ${item.who}</p>
                <p>Коли -- ${item.time}</p>
                <div>
                    <div  style="display: flex; flex-direction: column;">
                        <p>До -- ${item.before}</p>
                        <p>Після -- ${item.after}</p>
                    </div>
                </div>
            </div>
        </li>
    `
}



//fetch
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


