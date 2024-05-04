const express = require('express');
const app = express();
const port = 3050;
const fs = require('fs');
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    try {
        // fs.readFile('./file.txt','utf-8', (err, data) => {
        //     if(err) console.log('err');
        //     // console.log('data -> ', data)
        //     res.json({ status: 200, data: 'Hello world' })
        // })
        res.json({ status: 200, data: 'Hello world' })
    } catch(e) {
        console.log('error -> ', e)
    }
})

function auth(req, res, next) {
    // validation
    const { username, password } = req.headers;
    if(username === 'Dinesh' && password === '123456') {
        next();
    } else {
        res.json({ status: 401, data: 'Unauthorized' })
    }

}

app.get('/login', auth ,(req, res) => {
    try {
        fs.readFile('./file.txt','utf-8', (err, data) => {
            if(err) {
                return res.status(500).json({ status: 500, data: err }); 
            }
            return res.json({ status: 200, data })
        })
    } catch(e) {
        console.log('error -> ', e)
    }
})

app.listen(port,() => console.log(`Server listening on port ${port}`))
