const express = require('express');
const app = express();
const cors = require('cors');

// middleware
app.use(express.json());
app.use(cors());

// সঠিক পাথ: এক ধাপ উপরে গিয়ে data ফোল্ডারে ঢোকা
const data = require('../data/db.json');

app.get('/', (req, res) => {
  res.send('Next News API Server is running!');
});

// Get all news
app.get('/api/news', (req, res) => {
    const { search, category } = req.query; 
    let filteredNews = data; 
  
    if (search) {
      const searchText = search.toLowerCase();
      filteredNews = filteredNews.filter((newsItem) => {
        const titleMatch = newsItem.title.toLowerCase().includes(searchText);
        const descriptionMatch = newsItem.description.toLowerCase().includes(searchText);
        return titleMatch || descriptionMatch;
      });
    }
  
    if (category) {
      const categoryText = category.toLowerCase();
      filteredNews = filteredNews.filter((newsItem) => {
        return newsItem.categories && newsItem.categories.map(cat => cat.toLowerCase()).includes(categoryText);
      });
    }
  
    res.json(filteredNews);
});

// Get single news
app.get('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const newsItem = data.find((item) => item._id === id);

  if (!newsItem) {
    return res.status(404).send({ message: 'News item not found' });
  }
  res.json(newsItem);
});

// Vercel-এর জন্য এটি আবশ্যিক
module.exports = app;