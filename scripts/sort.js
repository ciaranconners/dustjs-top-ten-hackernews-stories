const karmaSort = document.getElementById('karma-sort');
const scoreSort = document.getElementById('score-sort');
const storiesContainer = document.getElementById('stories-container');
const stories = document.getElementsByClassName('story');

const storiesArray = [];
for (let s of Object.keys(stories)) {
  storiesArray.push(stories[s]);
}

karmaSort.addEventListener('click', () => {
  storiesArray.sort((a, b) => {
    const aKarma = parseInt(a.childNodes[3].childNodes[2].innerHTML, 10);
    const bKarma = parseInt(b.childNodes[3].childNodes[2].innerHTML, 10);
    if (aKarma < bKarma) {
      return 1;
    } else if (bKarma < aKarma) {
      return -1;
    } else {
      return 0;
    }
  });
  for (let s of storiesArray) {
    storiesContainer.appendChild(s);
  }
});

// scoreSort.addEventListener('click', () => {
//   storiesArray.sort((a, b) => {
//     const aKarma = parseInt(a.childNodes[3].childNodes[2].innerHTML, 10);
//     const bKarma = parseInt(b.childNodes[3].childNodes[2].innerHTML, 10);
//     if (aKarma < bKarma) {
//       return 1;
//     } else if (bKarma < aKarma) {
//       return -1;
//     } else {
//       return 0;
//     }
//   });
//   for (let s of storiesArray) {
//     storiesContainer.appendChild(s);
//   }
// });
