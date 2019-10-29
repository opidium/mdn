const fetch = require('node-fetch');

const references = [
    "Global_Objects",
    "Operators",
    "Statements",
    "Functions",
    "Classes",
    "Errors"
];

module.exports = async (pages = []) => {
    for (const reference of references) {
        console.log(`Loading ${reference}...`)
        const data = await fetch("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/" + reference + "$children?expand").then(res => res.json());
        subpages(data.subpages, pages)
    }
    return pages;
}


function subpages(subpages, pages) {
    for (const subpage of subpages) {
        pages.push(subpage);
        for (const page of subpage.subpages) {
            pages.push(page)
        }
    }

    return pages;
}