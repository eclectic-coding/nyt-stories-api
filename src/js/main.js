import '../../src/styles/main.scss';
require('dotenv').config()

const API_KEY = process.env.API_KEY
const endpoint = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`
let elApp = document.querySelector('#app')

function getNews() {
  return fetch(endpoint)
    .then(resp => {
      if (resp.ok) {
        return resp.json()
      } else {
        return Promise.reject(resp)
      }
    })
    .then(data => {
      let latestStories = data.results.map(story => {
        return {
          section: story.subsection ? story.subsection : story.section,
          title: story.title,
          url: story.url,
          image: story.multimedia ? story.multimedia.find( image => image.format === "mediumThreeByTwo210" ).url : "",
          byline: story.byline,
          abstract: story.abstract,
          date: story['published_date']
        }
      })
      console.log(latestStories)
      displayFeed(latestStories)
    })
    .catch(error => console.log('Doh! Something weird happened. '))
}

getNews()

function displayFeed(stories) {

  let listFeed = `<ul>`
  stories.forEach(story => {

    let date = new Date(story.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    listFeed += `
      <li class="story__border">
        <a href="${story.url}">
          <div>
              <img class="story__box-image" src="${story.image}" alt="">
            <div class="story__box-content">
              <p class="story__section">${story.section}</p>
              <p class="story__title">${story.title}</p>
              <p>${story.abstract}</p>
              <p class="story__date">${date}</p>
            </div>
          </div>
        </a>
        <hr>
       </li>
    `
  })
  listFeed += `</ul>`
  elApp.innerHTML = listFeed
}
