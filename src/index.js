const crawler = require('crawler');


(async () => {
    const item = await crawler('바다', 10);

    console.log(item);
})();