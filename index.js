const fetch = require('node-fetch');
const mdn = [];

const references = [
    'Global_Objects',
    'Operators',
    'Statements',
    'Functions',
    'Classes',
    'Errors'
];

function subpages(subpages, pages) {
    for (const subpage of subpages) {
        pages.push(subpage);
        for (const page of subpage.subpages) {
            pages.push(page);
        }
    }

    return pages;
}

async function search(pages = []) {
    console.log(`Loading...`);
    const responses = await Promise.all(references.map(ref => fetch(`https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/${ref}$children?expand`)))
    const collection = await Promise.all(responses.map(res => res.json()));
    console.log(`Loaded...`);
    for (const data of collection) {
        subpages(data.subpages, pages);
    }

    return pages;
};

search(mdn);

module.exports = async (req, res) => {
    if (!mdn.length) await search(mdn);
    if (!req.query.q) return res.status(401).json({ status: 401, uwu: 'no query provided!' });
    const item = mdn.find(({ title }) => title.toLowerCase().replace(/\(\)/g, '').replace(/.prototype./g, '.') === req.query.q.toLowerCase().replace(/.prototype./g, '.'));
    if (!item) return res.status(402).json({ status: 402, uwu: 'requested information not found!' });

    const methods = item.subpages.filter(page => page.tags && page.tags.includes('Method'))
        .map(page => ({ title: page.title, url: `https://developer.mozilla.org${page.url}`, type: 'method' }));
    const properties = item.subpages.filter(page => page.tags && page.tags.includes('Property'))
        .map(page => ({ title: page.title, url: `https://developer.mozilla.org${page.url}`, type: 'property' }));

    return res.json({
        url: `https://developer.mozilla.org${item.url}`,
        title: item.title,
        summary: item.summary,
        properties: [...properties],
        methods: [...methods]
    });
};