
const {Router, request} = require('express');
const mongoose = require('mongoose')
const router = Router();
const Path = require('path');
const fs = require('fs');
const {check, validationResult} = require('express-validator');

const account = require('../models/account');

let accounts = []; //масив який динамічно змінюється на сервері щоб відповідаючи на деяі запроси не робити запит на БД


const personPaymaster = [
    users = [
        {
            email: 'A@gmail.com',
            password: '123',
        }
    ],
    {
        src: `./src/js/main.js`,
        body: `
            <div class="main__options-paymaster">
            <h4>Опції:</h4>
            <p class='main__options-paymaster-one btn-click'>створення транзакції</p>
            <p class='main__options-paymaster-two'>перегляд списку змін</p>
            </div>
            <div class="main__content-paymaster">
                <div class="main__content-paymaster-form">
                    <form id="form">
                            <label for="validationDefault04" class="form-label">Назва рахунку</label>
                            <select class="form-select list-names" id="form-1" style="width: 60%;" required>
                                
                                
                            </select>
                            <hr>
                            <label for="validationDefault01" class="form-label">Сума</label>
                            <input type="number" class="form-control" id="form-2" style="width: 60%;" required>
                            <hr>
                            <label for="validationDefault04" class="form-label">Напрямок транзакції</label>
                            <select class="form-select input-suma-place" id="form-3" style="width: 60%;" required>
                                <option selected disabled value="">Оберіть...</option>
                                <option>прихід</option>
                                <option>витрата</option>
                            </select>
                            <hr>
                            <div class="form-floating">
                                <textarea style="max-height:100px;" class="form-control" placeholder="Leave a comment here" id="form-4" style="height: 100px"></textarea>
                                <label for="floatingTextarea2">Призначення платежу</label>
                            </div>
                            
                            <button class="btn btn-primary" id="btn-create" >Створити</button>
                    </form>
                    <div class="main__content-paymaster-form__remainder">
                        <div>
                                <h4>Стан рахунку</h4>
                                <p>до транзакції: <span id="currenValue1"></span></p>
                                <p>після транзакції: <span id="currenValue2"></span></p>
                                <p style="margin-top: 10px;"><strong>Час:</strong> <span id="time"></span></p>
                        </div>
                    </div>
                </div>

                <div class="main__content-paymaster-list main-content-active" style="height: 100%;">
                    <ul class="main__content-paymaster-list__ul">
                    </ul>
                </div>
            </div>
        `
    }
]

const personAdm = [
    users = [
        {
            email: 'E@gmail.com',
            password: '123',
        }
    ],
    {
        src: `./src/js/mainADM.js`,
        body: `
            <div class="main__options-ADM">
            <h4>Опції:</h4>
            <p class='main__options-ADM-one btn-click'>створення нового рахунку</p>
            <p class='main__options-ADM-two'>перегляд всіх рахунків</p>
            </div>
            <div class="main__content-ADM-C">
                <div class="main__content-ADM__form">
                    <form>
                        <label for="validationDefault01" class="form-label">Назва рахунку</label>
                        <input type="text" class="form-control input-suma-place" id="validationDefault01" style="width: 40%;" required />
                        <hr>
                        <label for="validationDefault02" class="form-label">Кількість коштів на рахунку</label>
                        <input type="number" class="form-control input-suma-place" id="validationDefault02" style="width: 40%;" required />
                        <hr>
                        <label for="validationDefault03" class="form-label">Назва банку в якому відкритий рахунку</label>
                        <input type="text" class="form-control input-suma-place" id="validationDefault03" style="width: 40%;" required />
                        <hr>
                        <label for="validationDefault04" class="form-label">Номер рахунку</label>
                        <input type="text" minlength="16" class="form-control input-suma-place" id="validationDefault04" style="width: 40%;" required />
                        <hr>
                        <button class="btn-primary btn" id="btn-create" >Створити</button>
                    </form>
                </div>

                <div class="main__content-ADM__list main-content-active">
                    <ul id="main__content-ADM__list__ul">
                    </ul>
                </div>

            </div>
        `
    }
]


async function start() {
    const mUri = 'mongodb+srv://kushnir:1234qwerty@cluster0.qqwk0.mongodb.net/app?retryWrites=true&w=majority';
    try {
        await mongoose.connect(mUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (e) {
        console.log('Server error in connect:', e.message);
        process.exit();
    }
}

start()
router.get('*', async (req, res) => { //роут для поверення сторінок
    try {
        
        accounts = await account.find({})

        let url = req.url;

        if(url == '/') {
            url = '/index.html';
        }
        
        let fileName = Path.resolve(__dirname, `..${url}`);

        if (!fs.existsSync(fileName)) {
            throw new Error();
        }

        res.sendFile(Path.resolve(fileName));
    }
    catch (error) {
        console.error(`Error in send file: ${error}`);
        res.status(404).sendFile(Path.resolve(__dirname, '../src/error.html'))
    }
})



router.post('/api/auth', 
        [
            check('email', 'error1').isEmail(),
            check('password', 'erro2').isLength({min:3})
        ],
        (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors:errors.array(),
            message: 'Помилка авторизації'
        })
    }

    try {
        const request = req.body;

        personAdm[0].forEach((el, i) => {
            if(el.email === request.email && el.password === request.password) {
                const data = {
                    body: personAdm[1].body,
                    src: personAdm[1].src,
                    statusName: 'Адміністратор'
                }
            
                return res.send(data)
            }

        })

        personPaymaster[0].forEach(el => {
            if(el.email === request.email && el.password === request.password) {
                const data = {
                    body: personPaymaster[1].body,
                    src: personPaymaster[1].src,
                    statusName: 'Касир'
                }

                return res.send(data)
            }
        })

    } catch (error) {
        console.log('Error in auth:', error)
    }
})

router.post('/api/ADM/add', async (req, res) => {
    const body = req.body;

    const item = new account({
        name: body.name,
        value: body.value,
        bank: body.bank,
        bankNumber: body.bankNumber
    })

    try {
        if(accounts.length > 0) {
            const promise = new Promise((resolve, reject) => {
                accounts.forEach((el, i) => {
                    if((el.name === body.name || el.bankNumber === body.bankNumber) && accounts.length > 0) {
                        res.status(400).json('Такий рахунок вже існує');
                        reject();
                    }
                }) 
                resolve()
            })
            promise.then(() => {
                item.save();
                res.status(201).json('Створено')
            })
        } else {
            
            await item.save();

            res.status(201).json('Створено')
        }

        accounts = await account.find({})
        


    } catch (error) {
        console.log("Error in add accounts: ", error);
    }
})
router.post('/api/ADM/list', async (req, res) => {
    accounts = await account.find({})
    try {
        if(accounts.length > 0) {
            const list = accounts.map(el => {
                return {
                    name: el.name,
                    bankNumber: el.bankNumber,
                    bank: el.bank
                }
            })
        
            res.status(200).json(list)
        } else {
            res.status(200).json({})
        }
    } catch (error) {
        console.log('Error in send list:', error);
    }
})
router.post('/api/ADM/change', async (req, res) => {
    accounts = await account.find({})
    const name = req.body.name;
    accounts.forEach(el => {
        if(el.name === name) {
            res.status(200).send(el)
        }
    })

})
router.delete('/api/ADM/change', async (req, res) => {
    const Name = req.body.name;

    await account.findOneAndDelete({name: Name})
    accounts = await account.find({})

    res.status(200).json('true')
})
router.put('/api/ADM/change', async (req, res) => {
    const body = req.body;

    await account.findOneAndUpdate({name: body.stateName},{
        name: body.name,
        value: body.value,
        bank: body.bank,
        bankNumber: body.bankNumber,
    }).then(async (el) => {
        if(el.changes.length === 0) {
            await account.findOneAndUpdate({"name":body.name},{
                changes: [
                    {
                        time: `${new Date().getFullYear()}.${new Date().getMonth()+1}.${new Date().getDate()} - ${new Date().getHours()}:${new Date().getUTCMinutes()<10 ? '0' + new Date().getUTCMinutes() : new Date().getUTCMinutes()}`,
                        name: body.name,
                        who: "Адміністратор",
                        before: `Name:${el.name}; Value:${el.value}; Bank:${el.bank}; Bank number:${el.bankNumber}`,
                        after: `Name:${body.name}; Value:${body.value}; Bank:${body.bank}; Bank number:${body.bankNumber}`
                    }
                ],
            })
        } else if(el.changes.length > 0) {
            let change = el.changes;
            change.push({
                time: `${new Date().getFullYear()}.${new Date().getMonth()+1}.${new Date().getDate()} - ${new Date().getHours()}:${new Date().getUTCMinutes()<10 ? '0' + new Date().getUTCMinutes() : new Date().getUTCMinutes()}`,
                name: body.name,
                who: "Адміністратор",
                before: `Name:${el.name}; Value:${el.value}; Bank:${el.bank}; Bank number:${el.bankNumber}`,
                after: `Name:${body.name}; Value:${body.value}; Bank:${body.bank}; Bank number:${body.bankNumber}`,
            }) 

            await account.findOneAndUpdate({"name":body.name},{
                changes: change,
            })
        }

        accounts = await account.find({})

    })

    res.status(201).json('true')

})



//payMaster

router.post('/api/PM/scoreOption', async (req, res) => {
    accounts = await account.find({});

    const newData = accounts.map(el => {
        return {
            name: el.name,
            value: el.value
        }
    })

    res.status(200).json(newData);
})

router.post('/api/PM/saveTr', async (req, res) => {
    const body = req.body;

    try {
        await account.findOneAndUpdate({name: body.name}, {})
            .then(async el => {
                await account.findOneAndUpdate({name: body.name}, {
                    value: body.rout === 'витрата' ? el.value - body.value : Number(el.value) + Number(body.value),
                })
                return el
            })
            .then(async el => {
                if(el.transaction.length === 0) {
                    await account.findOneAndUpdate({name: body.name}, {
                        transaction: [
                            {
                                name: body.name,
                                who: "Касир",
                                rout: `${body.rout}`,
                                valueBefore: el.value,
                                valueAfter: body.rout === 'витрата' ? el.value - body.value : Number(el.value) + Number(body.value),
                                time: body.time
                            }
                        ]
                    })
                }
                else {
                    let transactions = el.transaction;
                    transactions.push({
                        name: body.name,
                        who: "Касир",
                        rout: `${body.rout}`,
                        valueBefore: el.value,
                        valueAfter: body.rout === 'витрата' ? el.value - body.value : Number(el.value) + Number(body.value),
                        time: body.time
                    })

                    await account.findOneAndUpdate({name: body.name}, {
                        transaction: transactions,
                    })
                }
            })
            .then(() => res.status(201).json('true'))

        accounts = await account.find({});
            
    } catch (e) {
        res.status(400).json('false')
        console.log('Error in save PM Tr:', e.message);
    }

})

router.post('/api/PM/list', async (req, res) => {
    accounts = await account.find({})
    const data = [];
    accounts.map(el => {
        if(el.changes) {
            el.changes.map(el => data.push(el))
        }

    })

    res.status(201).json(data)
})



module.exports = router;
