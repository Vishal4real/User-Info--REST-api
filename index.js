var express = require('express')
var users = require('./data.json')
var app = express()
const fs = require('fs')
const path = require('path')
const exp = require('constants')
var PORT = 3004

app.use(express.urlencoded({ extended: false })); //Middleware

// Not a best practice
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname,"/index.html"))
// });
// app.get('/css', (req, res) => {
//     res.sendFile(path.join(__dirname,"/style.css"))
// });
// app.get('/curd', (req, res) => {
//     res.sendFile(path.join(__dirname,"/curd.png"))
// });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});

app.get('/users', (req, res) => {
    const html = ` 
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `
    res.send(html)
});

app.get('/api/users', (req, res) => {
    return res.json(users)
});

app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user)
    }).patch((req, res) => {
        const id = Number(req.params.id);
        const body = req.body;
        const user = users.findIndex((user) => user.id === id);
        if (user !== -1) {
            users[user] = { ...users[user], ...body };
            fs.writeFile('./data.json', JSON.stringify(users), (err, data) => {
                return res.json({ status: 'Success', id });
            });
        } else {
            return res.status(404).json({ error: 'User Not Found' })
        }

    }).delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            fs.writeFile('./data.json', JSON.stringify(users), (err) => {
                return res.json({ status: 'Success', id });
            });
        } else {
            return res.status(404).json({ error: 'User not found' })
        }

    })
app.post('/api/users', (req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./data.json', JSON.stringify(users), (err, data) => {
        return res.json({ status: 'Success', id: users.length })
    });
});

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))