document.addEventListener("DOMContentLoaded", function() {
  fetchArticles();
});

async function fetchArticles() {
  try {
      const response = await fetch('/api/articles');
      const articles = await response.json();
      renderBlogCards(articles);
  } catch (error) {
      console.error('Error fetching articles:', error);
  }
}

function renderBlogCards(articles) {
  const blogContainer = document.getElementById('blogContainer');
  blogContainer.innerHTML = ''; // 清空容器

  articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      card.innerHTML = `
          <h3>${article.title}</h3>
          <p>${article.content.substring(0, 100)}...</p>
          <button onclick="showArticle('${article.id}')">閱讀更多</button>
      `;
      blogContainer.appendChild(card);
  });
}

async function fetchArticleContent(pageId) {
  try {
      const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
          headers: {
              'Authorization': `Bearer ${NOTION_API_KEY}`,
              'Notion-Version': '2022-06-28',
              'Content-Type': 'application/json'
          }
      });
      const data = await response.json();
      displayArticle(data.results);
  } catch (error) {
      console.error('Error fetching article content:', error);
  }
}

function displayArticle(blocks) {
  const articlePage = document.getElementById('articlePage');
  const homepage = document.getElementById('homepage');
  const articleTitle = document.getElementById('articleTitle');
  const articleMeta = document.getElementById('articleMeta');
  const articleContent = document.getElementById('articleContent');

  // Clear previous content
  articleContent.innerHTML = '';

  blocks.forEach(block => {
      const paragraph = document.createElement('p');
      paragraph.textContent = block.paragraph.text[0].text.content;
      articleContent.appendChild(paragraph);
  });

  homepage.style.display = 'none';
  articlePage.style.display = 'block';
}

function showArticle(articleId) {
  fetchArticleContent(articleId);
}

function showHomepage() {
  const articlePage = document.getElementById('articlePage');
  const homepage = document.getElementById('homepage');
  
  articlePage.style.display = 'none';
  homepage.style.display = 'block';
}
