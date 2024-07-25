require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');

const app = express();
app.use(cors());

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

app.get('/api/articles', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Created time',
          direction: 'descending',
        },
      ],
    });
    
    const articles = response.results.map(page => ({
      id: page.id,
      title: page.properties.Name.title[0].plain_text,
      content: page.properties.Content.rich_text[0].plain_text,
    }));

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching articles' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));