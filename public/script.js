document.addEventListener("DOMContentLoaded", function() {
  fetchArticles();
});

async function fetchArticles() {
  try {
      console.log('Fetching articles...');
      const response = await fetch('/api/articles');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const text = await response.text(); // 获取响应文本
      console.log('API response text:', text); // 打印响应文本
      const articles = JSON.parse(text); // 解析 JSON
      console.log('Articles fetched:', articles);
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
          <button onclick="showArticle('${article.id}')">閱讀更多</button>
      `;
      blogContainer.appendChild(card);
  });
}

async function fetchArticleContent(pageId) {
  console.log(`Fetching content for pageId: ${pageId}`);
  try {
      const response = await fetch(`/api/article/${pageId}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const text = await response.text(); // 获取响应文本
      console.log('API response text:', text); // 打印响应文本
      const blocks = JSON.parse(text); // 解析 JSON
      console.log('Article content fetched:', blocks);
      displayArticle(blocks);
  } catch (error) {
      console.error('Error fetching article content:', error);
  }
}

function displayArticle(blocks) {
  const articlePage = document.getElementById('articlePage');
  const homepage = document.getElementById('homepage');
  const articleTitle = document.getElementById('articleTitle');
  const articleContent = document.getElementById('articleContent');

  // Clear previous content
  articleContent.innerHTML = '';

  blocks.forEach(block => {
      if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
          const paragraph = document.createElement('p');
          paragraph.textContent = block.paragraph.rich_text[0].text.content;
          articleContent.appendChild(paragraph);
      }
  });

  homepage.style.display = 'none';
  articlePage.style.display = 'block';
}

function showArticle(pageId) {
  fetchArticleContent(pageId);
}

function showHomepage() {
  const articlePage = document.getElementById('articlePage');
  const homepage = document.getElementById('homepage');
  
  articlePage.style.display = 'none';
  homepage.style.display = 'block';
}
