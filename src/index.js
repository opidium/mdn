const MozilaSearch = require('./search');
const express = require('express');
const app = express();
const mdn = [];

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/search', async (req, res) => {
	if (!req.query.q) return res.status(401).json({ status: 401, uwu: 'no query provided!' });

	const item = mdn.find(({ title }) => title.toLowerCase().replace(/\(\)/g, '').replace(/.prototype./g, '.') === req.query.q.toLowerCase().replace(/.prototype./g, '.'));

	if (!item) return res.status(402).json({ status: 402, uwu: 'requested information not found!' });

	return res.json({ url: item.url, title: item.title, summary: item.summary });
});

app.use((req, res) => res.send({ uwu: 'you are in the wrong part of town!' }));

app.listen(8081, async () => {
	await MozilaSearch(mdn);
	console.log('Server Listening on Port 8081');
});
