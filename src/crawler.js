const GoogleImages = require('google-images')

const client = new GoogleImages('3484cfbda139369e6', 'AIzaSyAwYk4s_EX66AZ-tQAiq7BcWnI9QyIWjP8'); // 'CSE ID', 'API KEY'

client.search('Apple')
        .then(images => {
            console.log(images);
        });

client.search('Steve Angello', {page:2});