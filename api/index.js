const express = require('express');
const app = express();
const cors = require('cors');

// middleware
app.use(express.json());
app.use(cors());

// ডেটা ইমপোর্ট (নিশ্চিত করুন data ফোল্ডারটি রুট ডিরেক্টরিতে আছে)
const data = require('../data/db.json');

app.get('/', (req, res) => {
  res.send('Next News API Server is running!');
});

// সব নিউজ দেখার জন্য API
app.get('/api/news', (req, res) => {
    const { search, category } = req.query;
    let filteredNews = data;

    if (search) {
      const searchText = search.toLowerCase();
      filteredNews = filteredNews.filter((newsItem) => {
        return newsItem.title.toLowerCase().includes(searchText) || 
               newsItem.description.toLowerCase().includes(searchText);
      });
    }

    if (category) {
      const categoryText = category.toLowerCase();
      filteredNews = filteredNews.filter((newsItem) => {
        return newsItem.categories && newsItem.categories.some(cat => cat.toLowerCase() === categoryText);
      });
    }

    res.send(filteredNews);
});

// নির্দিষ্ট আইডি দিয়ে নিউজ খোঁজার জন্য
app.get('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const newsItem = data.find((item) => item.id === id); // আপনার ডেটাতে id না _id সেটি চেক করে নিন

  if (!newsItem) {
    return res.status(404).send({ message: 'News item not found' });
  }
  res.send(newsItem);
});

// Vercel এর জন্য এটি অত্যন্ত গুরুত্বপূর্ণ
module.exports = app;