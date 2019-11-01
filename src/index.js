const MozilaSearch = require('./search');
const express = require('express');
const app = express();
const Turndown = require('turndown');
const turndown = new Turndown();
const mdn = [];

turndown.addRule('hyperlink', {
	filter: 'a',
	replacement: (text, node) => `[${text}](https://developer.mozilla.org${node.href})`
});
turndown.addRule('markdown', {
	filter: 'strong',
	replacement: (text, node) => `\u200b**${text}**\u200b`
});
turndown.addRule('markdown', {
	filter: 'code',
	replacement: (text, node) => `\u200b\`${text}\`\u200b`
});

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

app.get('/v2/search', async (req, res) => {
	if (!req.query.q) return res.status(401).json({ status: 401, uwu: 'no query provided!' });

	const item = mdn.find(({ title }) => title.toLowerCase().replace(/\(\)/g, '').replace(/.prototype./g, '.') === req.query.q.toLowerCase().replace(/.prototype./g, '.'));

	if (!item) return res.status(402).json({ status: 402, uwu: 'requested information not found!' });

	const summary = item.summary.replace(/<code><strong>(.+)<\/strong><\/code>/g, '<strong><code>$1<\/code><\/strong>')
		.replace(/<code><(\s*a[^>]*)>(.*?)<\s*\/\s*a><\/code>/g, '<$1><code>$2<\/code><\/a>');
	return res.json({
		url: `https://developer.mozilla.org${item.url}`,
		title: item.title,
		summary: turndown.turndown(summary),
		subpages: item.subpages.map(({ title }) => title)
	});
});

app.use((req, res) => res.send({ uwu: 'you are in the wrong part of town!' }));

app.listen(8081, async () => {
	await MozilaSearch(mdn);
	console.log('Server Listening on Port 8081');
});
