require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

console.log('Server starting...');
console.log('NOTION_API_KEY:', NOTION_API_KEY); // 打印以调试
console.log('DATABASE_ID:', DATABASE_ID); // 打印以调试

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

        console.log('Notion API response data:', response.data); // 打印响应内容

        const articles = response.data.results.map(page => ({
            id: page.id,
            title: page.properties.Title.title[0].plain_text
        }));
        console.log('Sending articles response:', articles);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching data from Notion API:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/article/:id', async (req, res) => {
    const pageId = req.params.id;
    console.log(pageId)

    try {
        const response = await axios.get(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        console.log('Notion API blocks data:', response.data); // 打印响应内容

        const blocks = response.data.results.map(block => ({
            type: block.type,
            paragraph: block.paragraph
        }));
        console.log('Sending blocks response:', blocks);
        res.json(blocks);
    } catch (error) {
        console.error('Error fetching data from Notion API:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
