import axios from 'axios'; //подключаем библиотеку для запросов на сервер

//созаем и экспортируем класс по дефолту
export default class FetchSearchImages {
  //объявляем приватные переменные
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28704942-6968b84373f0d7bd37bb26e4e';
  //создаем конструктор и обьявляем перемменные
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.dataPerPage = 40;
    this.totalHits = null;
  }
  //создаем метод (делаем его асинхронным), с помощью которого будем делать запросы на сервер
  async fetchSearchImages() {
    // const searchParam = new URLSearchParams({
    //   image_type: this.photo,
    //   orientation: this.horizontal,
    //   safesearch: this.true,
    //   per_page: this.dataPerPage,
    // });
    //с помощью бибиотеки axios, делаем запрос, в котором 2-м аргументом прокидываем параметры запроса
    const request = await axios.get(`${this.#BASE_URL}`, {
      params: {
        image_type: this.photo,
        orientation: this.horizontal,
        safesearch: this.true,
        page: this.page,
        per_page: this.dataPerPage,
        q: this.searchQuery,
        key: this.#API_KEY,
      },
    });
    //вызываем метод увелчения страниц на 1
    this.incrementPage();
    return request;
  }
  //создаем метод увелчения страниц на 1
  incrementPage() {
    this.page += 1;
  }
  //метод сброса страниц
  resetPage() {
    this.page = 1;
  }
  //создаем метод для проверки, когда все картинки загрузились
  //((тек.кол.страниц(4) - 1) * кол.стр.при выводе(40)) <= общ.кол.стр.
  isNextDataExsist() {
    return (this.page - 1) * this.dataPerPage <= this.totalHits;
  }
  //геттер и сеттер нужного значения query
  get query() {
    return this.searchQuery;
  }
  set query(newquery) {
    this.searchQuery = newquery;
  }
}
