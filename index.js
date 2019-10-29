const MozilaSearch = require('./search');

const express = require('express');

const app = express();

const mdn = [];

Promise.resolve(MozilaSearch(mdn));

app.get('/', async (req, res) => {
    const item = mdn.find(({ title }) => {
        const query = req.query && req.query.query ? req.query.query.toLowerCase().replace(/.prototype./g, '.') : null;
        console.log(title.toLowerCase().replace(/\(\)/g, '').replace(/.prototype./g, '.'));
        return title.toLowerCase().replace(/\(\)/g, '').replace(/.prototype./g, '.') === query
    });
    console.log(item)
    return res.json(item)
});

app.listen(8000)