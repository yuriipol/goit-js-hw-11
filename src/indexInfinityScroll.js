//Импортируем библиотеки, темплейты и наш класс
import Notiflix from 'notiflix';
import templateCard from './templates/card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchSearchImages from './js/images-api';

//Получаем ссылки на наши елементы самой формы, галереи и кнопки загрузить еще
const searchForm = document.querySelector('#search-form');
const gallary = document.querySelector('.gallery');

//Создаем экземпляр класса
const fetchSearch = new FetchSearchImages();

const observer = new IntersectionObserver(
  (entries, observer) => {
    if (entries[0].isIntersecting) {
      loadMoreData();
    }
  },
  {
    root: null,
    rootMargin: '600px',
    threshold: 1,
  }
);
//Вешаем события прослушивания на форму и на кнопку загрузить еще
searchForm.addEventListener('submit', onSearchFormSubmit);

//Присваеваем переменной libraryLithBox ссылку на библиотеку SimpleLightbox
const libraryLithBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

//Создаем асинхронную функцию по событию submit
async function onSearchFormSubmit(event) {
  event.preventDefault();

  //Сеттером класса fetchSearch.query записываем значение инпута
  fetchSearch.query = event.currentTarget.elements.searchQuery.value;
  //сбрасываем методом счетчик страниц
  fetchSearch.resetPage();

  try {
    //в переменную response присваивавем результат значения метода fetchSearchImages() - это обьект
    const response = await fetchSearch.fetchSearchImages();

    //если колличество картинок=0, то очищаем галерею, сбрасываем поля формы
    //и вывыодим сообщения с помощью библиотеки Notiflix
    if (response.data.hits.length === 0) {
      gallary.innerHTML = '';

      event.target.reset();
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    //в переменную totalImages записываем колличество найденых картинок и выводим их в сообщении
    let totalImages = response.data.totalHits;
    Notiflix.Notify.info(`Hooray! We found ${totalImages} images`);
    //если переменная класса totalHits=null, тогда ей присваеваем значение общего колличества картинок

    fetchSearch.totalHits = response.data.totalHits;

    //отрисовываем наши картинки на странице с помощью библиотеки parcel-transformer-hbs
    gallary.innerHTML = templateCard(response.data.hits);

    observer.observe(document.querySelector('.target-element'));
    //вызываем библиотеку SimpleLightbox, а на ней метод refresh()
    libraryLithBox.refresh();
    //отображаем кнопку
  } catch (error) {
    console.log(error);
  }
}
//создаем функцию, которая рендерит наши картинки по кнопке загрузить еще
function renderCards(data) {
  const card = templateCard(data);
  gallary.insertAdjacentHTML('beforeend', card);
  libraryLithBox.refresh();
}
//создаем функцию плавного скролла
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

//Создаем асинхронную функцию по событию click
async function loadMoreData(event) {
  try {
    //если условие метода равно false, то выводим сообщениео том, что картинок для подзагрузки уже нет
    if (!fetchSearch.isNextDataExsist()) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results"
      );
      observer.unobserve(document.querySelector('.target-element'));
      return;
    }

    const response = await fetchSearch.fetchSearchImages();
    //рендерим картинки
    renderCards(response.data.hits);
    //запускаем плавный скролл
    smoothScroll();
  } catch (error) {
    console.log(error);
  }
}
