const MozilaSearch = require('./search');
const express = require('express');
const app = express();
const mdn = [];

app.get('/', async (req, res) => {
	if (!req.query.search) return res.status(401).json({ status: 401, uwu: 'no query provided!' });

	const item = mdn.find(({ title }) => {
		const query = req.query.search ? req.query.search.toLowerCase().replace(/.prototype./g, '.') : null;
		return title.toLowerCase().replace(/\(\)/g, '').replace(/.prototype./g, '.') === query;
	});

	if (!item) return res.status(402).json({ status: 402, uwu: 'requested information not found!' });

	return res.json({ url: item.url, title: item.title, summary: item.summary });
});

app.listen(8081, async () => {
	await MozilaSearch(mdn);
	console.log('Server Listening on Port 8081');
});
