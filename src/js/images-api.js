import axios from 'axios';

export default class FetchSearchImages {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28704942-6968b84373f0d7bd37bb26e4e';
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.dataPerPage = 40;
    this.totalHits = null;
  }

  async fetchSearchImages() {
    const searchParam = new URLSearchParams({
      image_type: this.photo,
      orientation: this.horizontal,
      safesearch: this.true,
      per_page: this.dataPerPage,
    });

    const request = await axios.get(
      `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
        this.searchQuery
      }&${searchParam}&page=${this.page}`
    );

    this.incrementPage();
    return request;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  isNextDataExsist() {
    return (this.page - 1) * this.dataPerPage <= this.totalHits;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newquery) {
    this.searchQuery = newquery;
  }
}
