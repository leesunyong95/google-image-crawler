const request = require('request');
const cheerio = require('cheerio');


const google = 'https://google.com';


function req(url) {
    return new Promise(function (resolve, reject) {
        request.get({
            url: url,
        }, function (err, reponse, body) {
            if (err) {
                reject(err);
                return;
            }
            let html = body;

            resolve(html);
        });
    });
}

function parse(html, page) {
    const items = [];

    const $ = cheerio.load(html);
    const $img = $('img');

    for (let i = 1; i < $img.length; i++) {
        const imageSrc = $img[i.toString()].attribs.src;
        const decodedImageSrc = decodeURIComponent(imageSrc);

        items.push(decodedImageSrc);
    }
    let nextpage;

    const $ttta = $('table tbody td a');
    if (page === 1) {
        for (let i = 1; i < $ttta.length; i++) {
            const aChildren = $ttta[i.toString()].children;
            if (aChildren) {
                const data = aChildren[0].data;

                if (data && encodeURIComponent(data.slice(0, 2)) === encodeURIComponent('다음')) {
                    nextpage = $ttta[i.toString()].attribs.href;
                    break;
                }
            }
        }
    } else {
        for (let i = 1; i < $ttta.length; i++) {
            const aChildren = $ttta[i.toString()].children;
            const name = aChildren[0].name;
            if (aChildren && name === 'span') {
                const data = aChildren[0].children ? aChildren[0].children[0].data : null;
                if (data && encodeURIComponent(data) === encodeURIComponent('>')) {
                    nextpage = $ttta[i.toString()].attribs.href;
                    break;
                }
            }
        }

    }

    return {
        items,
        nextpage
    }
}

async function search(keyword, num) {
    keyword = encodeURIComponent(keyword);

    let itemList = [];
    
    for (let url = `${google}/search?q=${keyword}&tbm=isch`, i = 1; itemList.length < num; i++) {
        const html = await req(url);
        const data = parse(html, i);

        if (num < data.items.length + itemList.length) {
            itemList = itemList.concat(data.items.slice(0, num - data.items.length - itemList.length));
        } else {
            itemList = itemList.concat(data.items);
        }

        if (data.nextpage) {
            url = `${google}${data.nextpage}`;
        } else {
            break;
        }
    }

    return itemList;
}


module.exports = search;