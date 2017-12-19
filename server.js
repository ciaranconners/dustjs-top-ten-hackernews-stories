const fs = require('fs');
const path = require('path');
const express = require('express');
const dust = require('dustjs-linkedin');
const axios = require('axios');

// Define a custom `onLoad` function to tell Dust how to load templates
dust.onLoad = (tmpl, cb) => {
  fs.readFile(path.join('./views', path.relative('/', path.resolve('/', `${tmpl}.dust`))),
    { encoding: 'utf8' }, cb);
};

const app = express();

app.use('/stylesheets', express.static(path.join(__dirname, './stylesheets')));
app.set('view engine', 'dust');

app.get('/', (req, res) => {
  const stories = [];
  axios
    .get('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then((response) => {
      const storyIDs = response.data.slice(0, 10);
      const storyPromises = [];
      storyIDs.forEach((el) => {
        storyPromises.push(axios.get(`https://hacker-news.firebaseio.com/v0/item/${el}.json`));
      });
      Promise.all(storyPromises)
        .then((storyResponses) => {
          const authorPromises = [];
          storyResponses.forEach((el) => {
            authorPromises.push(axios.get(`https://hacker-news.firebaseio.com/v0/user/${el.data.by}.json`));
          });
          Promise.all(authorPromises).then((authorResponses) => {
            storyResponses.forEach((s, i) => {
              const authorKarma = authorResponses[i].data.karma;
              const { title, score, url, time, by: authorId } = s.data;
              const story = {
                title,
                score,
                url,
                authorKarma,
                authorId,
                timestamp: new Date(time * 1000),
              };
              stories.push(story);
            });
            dust.stream('index', { stories }).pipe(res).on('end', () => {});
          })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
