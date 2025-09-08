import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.static(path.join(process.cwd(), 'public')));

const DATA_DIR = './data';
app.get('/api/items', (req, res) => {
    fs.readdir(DATA_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: 'Cannot read data folder' });

        const allData = [];
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const rawData = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
                allData.push(...JSON.parse(rawData));
            }
        });

        res.json(allData);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

