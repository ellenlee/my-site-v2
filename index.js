require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

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

        console.log('Notion API response data:', response.data); // 添加这行来打印响应内容

        const articles = response.data.results.map(page => ({
            id: page.id,
            title: page.properties.Title.title[0].plain_text
        }));

        res.json(articles);
    } catch (error) {
        console.error('Error fetching data from Notion API:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/article/:id', async (req, res) => {
    const pageId = req.params.id;

    try {
        const response = await axios.get(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        console.log('Notion API blocks data:', response.data); // 添加这行来打印响应内容

        const blocks = response.data.results.map(block => ({
            type: block.type,
            paragraph: block.paragraph
        }));

        res.json(blocks);
    } catch (error) {
        console.error('Error fetching data from Notion API:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
