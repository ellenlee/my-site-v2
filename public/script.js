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
          <button onclick="showArticle('${article.id}')">閱讀更多</button>
      `;
      blogContainer.appendChild(card);
  });
}

async function fetchArticleContent(pageId) {
  console.log(`Fetching content for pageId: ${pageId}`);
  try {
      const response = await fetch(`/api/article/${pageId}`);
      const blocks = await response.json();
      console.log('Fetched blocks:', blocks); // 打印获取到的块内容
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
