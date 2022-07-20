//Импортируем библиотеки, темплейты и наш класс
import Notiflix from 'notiflix';
import templateCard from './templates/card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchSearchImages from './js/images-api';

//Получаем ссылки на наши елементы самой формы, галереи и кнопки загрузить еще
const searchForm = document.querySelector('#search-form');
const loadMore = document.querySelector('.load-more');
const gallary = document.querySelector('.gallery');

//Создаем экземпляр класса
const fetchSearch = new FetchSearchImages();

//Вешаем события прослушивания на форму и на кнопку загрузить еще
searchForm.addEventListener('submit', onSearchFormSubmit);
loadMore.addEventListener('click', onClickLoadMore);

//Присваеваем переменной libraryLithBox ссылку на библиотеку SimpleLightbox
const libraryLithBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

//Создаем асинхронную функцию по событию submit
async function onSearchFormSubmit(event) {
  event.preventDefault();
  //прячем кнопку
  loadMore.classList.add('is-hidden');
  //Сеттером класса fetchSearch.query записываем значение инпута
  fetchSearch.query = event.currentTarget.elements.searchQuery.value;
  //сбрасываем методом счетчик страниц
  fetchSearch.resetPage();

  try {
    //в переменную response присваивавем результат значения метода fetchSearchImages() - это обьект
    const response = await fetchSearch.fetchSearchImages();
    console.log('~ response', response);
    //если колличество картинок=0, то очищаем галерею, скрываем кнопку загрузить еще, сбрасываем поля формы
    //и вывыодим сообщения с помощью библиотеки Notiflix
    if (response.data.hits.length === 0) {
      gallary.innerHTML = '';
      loadMore.classList.add('is-hidden');
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
    if (fetchSearch.isNextDataExsist()) {
      loadMore.classList.remove('is-hidden');
    } else {
      loadMore.classList.add('is-hidden');
    }
    console.log(fetchSearch.isNextDataExsist());
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
async function onClickLoadMore(event) {
  try {
    //если условие метода равно false, то выводим сообщениео том, что картинок для подзагрузки уже нет
    if (!fetchSearch.isNextDataExsist()) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results"
      );
      //прячем кнопку
      loadMore.classList.add('is-hidden');
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
