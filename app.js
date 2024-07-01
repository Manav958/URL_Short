const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const QRCode = require('qrcode');
<<<<<<< HEAD
const fs = require('fs');



const redisClient = redis.createClient({url:'redis://red-cq0ho93v2p9s73cafq9g:6379'});
=======

const redisClient = redis.createClient({url:'redis://red-cq0ho93v2p9s73cafq9g:6379'});
>>>>>>> 305dc1039eb52bec3cec39d215e37f0a864e6373
redisClient.on('error', (err) => console.log('Redis Client Error', err));
(async ()=>{
    await redisClient.connect();
})();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req,res)=>{
    res.render('home.ejs');
})

app.post('/shorten', async (req, res) => {
    const originalUrl = req.body.url;
    const time = req.body.time;
    const slug = generateSlug();
    console.log(time);

    await redisClient.set(slug, originalUrl);
    await redisClient.expire(slug, parseInt(time));

    const shortenedUrl = `${req.protocol}://${req.headers.host}/${slug}`;
    console.log(`Shortened URL: ${shortenedUrl}`);

    
    QRCode.toDataURL(shortenedUrl, (err, qrCodeDataUrl) => {
        if (err) {
            console.error('Error generating QR code:', err);
            res.status(500).send('Error generating QR code');
            return;
        }

        
<<<<<<< HEAD
        res.render('result.ejs', { shortenedUrl, qrCodeDataUrl,slug });
=======
        res.render('result.ejs', { shortenedUrl, qrCodeDataUrl });
>>>>>>> 305dc1039eb52bec3cec39d215e37f0a864e6373
    });
});

app.get('/download/:slug', async (req, res) => {
    const slug = req.params.slug;
    const shortenedUrl = `${req.protocol}://${req.headers.host}/${slug}`;
    const filePath = `qrcode-${slug}.png`;

    QRCode.toFile(filePath, shortenedUrl, (err) => {
        if (err) {
            console.error('Error generating QR code:', err);
            res.status(500).send('Error generating QR code');
            return;
        }

        res.download(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
                return;
            }

            // Optionally delete the file after sending
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        });
    });
});
app.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    console.log(slug);
    const link=(await redisClient.get(slug,console.log))
    res.redirect(link)
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function generateSlug() {
    return Math.random().toString(36).substr(2, 7);
}


// https://url-short-c70q.onrender.com/
