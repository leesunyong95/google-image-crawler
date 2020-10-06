const search = require('./search');
const download = require('./download');


module.exports = async function crawler(keyword, num = 1000) {
    const itemList = await search(keyword, num);

    console.log(itemList.length + " item(s) crawled.");

    await download(itemList, keyword);
}