require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/articles', async (req, res) => {
    try {
        const response = await axios.post(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {}, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        const articles = response.data.results.map(page => ({
            id: page.id,
            title: page.properties.Title.title[0].plain_text,
            content: page.properties.Content.rich_text[0].plain_text,
            date: page.properties.Date.date.start,
            author: page.properties.Author.rich_text[0].plain_text,
            status: page.properties.Status.status.name
        }));

        res.json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
