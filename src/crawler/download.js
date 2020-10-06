const fs = require('fs');
const request = require('request');


const directory = 'image/';


async function downloadImage(uri, filename, callback) {
    await request.head(uri, async function(err, res, body) {
        if (res) {
            const extension = res.headers['content-type'].slice(6);

            await request(uri).on('error', (error) => {
                console.log(error);
            }).pipe(fs.createWriteStream(directory + filename + '.' + extension));
        }
    })
}

async function download(itemList, keyword) {

    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }

    for (let i = 0; i < itemList.length; i++) {
        await downloadImage(itemList[i], keyword + '_' + i, () => {
        });
    }
}


module.exports = download;