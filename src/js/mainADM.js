//Р-Адміністратора

const createScore = document.querySelector('.main__options-ADM-one');
const seeList = document.querySelector('.main__options-ADM-two');
const ulList = document.getElementById('main__content-ADM__list__ul');
const input1 = document.getElementById('validationDefault01');
const input2 = document.getElementById('validationDefault02');
const input3 = document.getElementById('validationDefault03');
const input4 = document.getElementById('validationDefault04');
const btnCreate = document.getElementById('btn-create');



const optionOne = document.querySelector('.main__options-ADM-one');
const optionTwo = document.querySelector('.main__options-ADM-two');
const contentForm = document.querySelector('.main__content-ADM__form');
const contentList = document.querySelector('.main__content-ADM__list');




createScore.addEventListener('click', contentADM);
seeList.addEventListener('click', contentADM);
ulList.addEventListener('click', sitting);
btnCreate.addEventListener('click', createForm);
loadList()





function contentADM(event) {

    if(event.target.classList[0] === 'main__options-ADM-one') {
        optionOne.classList.add('btn-click');
        optionTwo.classList.remove('btn-click');
        contentForm.classList.remove('main-content-active');
        contentList.classList.add('main-content-active');

    } else if(event.target.classList[0] === 'main__options-ADM-two') {
        optionOne.classList.remove('btn-click');
        optionTwo.classList.add('btn-click');
        contentForm.classList.add('main-content-active');
        contentList.classList.remove('main-content-active');
    }
}

function sitting(event) {
    const status = event.target.classList[0];
    const statusName = event.target.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1].innerHTML;
    if(status === 'change') {
        request('/api/ADM/change', {name: statusName}, 'POST')
            .then(res => {
                const modal = createModal(res);
                const div = document.createElement('div');
                div.classList.add('layout');
                div.style.display = 'flex';
                return {modal, div}
            })
            .then(res => {
                res.div.innerHTML = res.modal;
                document.body.insertBefore(res.div, document.querySelector('.container'));
            })
            .then(() => {
                const modalBtn = document.getElementById('modal-btn');
                modalBtn.addEventListener('click', sendNewInfo);
            })
            .then(() => {
                const closeModal = document.getElementById("close");
                closeModal.addEventListener('click', (e) => {
                    e.preventDefault();
                    //FETCH(S)
        
                    document.body.removeChild(document.querySelector('.layout'));
                })
            })


    } else if(status === 'delete') {
        request('/api/ADM/change', {name: statusName}, 'DELETE').then(() => loadList())
    }
}

function createModal(item) {
    return `
        <div class="layout__content">
            <form>
                <h4 style="text-align: center; margin-bottom: 15px;">Редагувати рахунок</h4>
                <label for="validationDefault01" class="form-label">Назва рахунку -- <span id="modal-1">${item.name}</span></label>
                <input type="text" class="form-control input-suma-place" id="modal-name" style="width: 40%;">
                <hr>
                <label for="validationDefault01" class="form-label">Кількість коштів на рахунку -- <span id="modal-2">${item.value}</span></label>
                <input type="number" class="form-control input-suma-place" id="modal-value" style="width: 40%;">
                <hr>
                <label for="validationDefault01" class="form-label">Назва банку в якому відкритий рахунку -- <span id="modal-3">${item.bank}</span></label>
                <input type="text" class="form-control input-suma-place" id="modal-bank" style="width: 40%;">
                <hr>
                <label for="validationDefault01" class="form-label">Номер рахунку -- <span id="modal-4">${item.bankNumber}</span></label>
                <input type="text" minlength="16" class="form-control input-suma-place" id="modal-bankNumber" style="width: 40%;" required />
                <hr>
                <button class="btn btn-primary" id="modal-btn">Підтвердити</button>
                <button class="btn btn-primary" id='close' style="background: crimson; border: 1px solid crimson;" type="submit">Відмінити</button>
            </form>
        </div>
    `
}

//fetch for form // проблема із валідацією при формі
function createForm(event) {
    

    const data = {
        name: input1.value,
        value: input2.value,
        bank: input3.value,
        bankNumber: input4.value
    }


    if(data.name !== '' && data.value !== '' && data.bank !== '' && data.bankNumber.length >= 16) {
        event.preventDefault();
        event.target.disabled = true;


        request('/api/ADM/add', data, 'POST')
        .then(res => document.getElementById('reaction__in').innerHTML = res)
        .then( () => reactAnimation() )
        .then( () =>  loadList() )
        .then(() => {
            input1.value = '';
            input2.value = '';
            input3.value = '';
            input4.value = '';
        })
        .then(() => btnCreate.disabled = false)
    }

   
}
function sendNewInfo(event) {
    let mName = document.getElementById('modal-name').value;
    let mValue = document.getElementById('modal-value').value;
    let mBank = document.getElementById('modal-bank').value;
    let mBankName = document.getElementById('modal-bankNumber').value;

    const modal1 = document.getElementById('modal-1').innerHTML;
    const modal2 = document.getElementById('modal-2').innerHTML;
    const modal3 = document.getElementById('modal-3').innerHTML;
    const modal4 = document.getElementById('modal-4').innerHTML;

    const data = {
        name: mName || modal1,
        value: mValue || modal2,
        bank: mBank || modal3,
        bankNumber: mBankName || modal4,
        stateName: modal1
    }

    if(data.name !== '' && data.value !== '' && data.bank !== '' && data.bankNumber.length >= 16) {
        event.preventDefault();
        event.target.disabled = true;

        request('/api/ADM/change', data, "PUT")
            .then(() => loadList())
            .then(() => {
                mName = '';
                mValue = '';
                mBank = '';
                mBankName = '';
            })
            .then(() => {
                event.target.disabled = false;
            })
            .then(() => {
                document.body.removeChild(document.querySelector('.layout'));
            })

    }
}


function reactAnimation() {
    const reaction = document.querySelector('.reaction');

    reaction.classList.remove('reaction--disabled');
    reaction.classList.add('reaction--active');
    setTimeout(() => {
        reaction.classList.remove('reaction--active');
        reaction.classList.add('reaction--disabled');
    }, 5000)

}

//create list 
function loadList() {
    request('/api/ADM/list', null, "POST").then(res => res.length > 0 ? createList(res) : document.getElementById('main__content-ADM__list__ul').innerHTML = '<p style="text-align: center;">Пусто</p>')
}
function createList(list) {
    const newList = list.map(item => createItem(item)).join('');

    document.getElementById('main__content-ADM__list__ul'). innerHTML = newList;
}
function createItem(item) {
    return `
        <li>
            <div>
                <p>Назва рахунку: <span>${item.name}</span></p>
                <div>
                    <p>Назва банку: ${item.bank}</p>
                    <p>Номер рахунку в банку: ${item.bankNumber}</p>
                </div>
            </div>
            <div  class="icon" style="display: flex; gap: 30px; margin-top: 10px;">
                <i style="cursor: pointer;" title="видалити" class=" delete far fa-trash-alt "></i>
                <i style="cursor: pointer;" title="редагувати" class=" change fas fa-cogs "></i>
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





