import Notiflix from 'notiflix';
import templateCard from './templates/card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchSearchImages } from './js/images-api';
import templateCard from './templates/card.hbs';

const searchForm = document.querySelector('#search-form');
const gallary = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit(event) {
  event.preventDefault();
  let searchQuery = event.currentTarget.elements.searchQuery.value;

  fetchSearchImages(searchQuery)
    .then(data => {
      console.log(data);
      renderCards(data.hits);
    })
    .catch(err => console.dir(err));
}

function renderCards(data) {
  const card = templateCard(data);
  gallary.innerHTML = card;
}
