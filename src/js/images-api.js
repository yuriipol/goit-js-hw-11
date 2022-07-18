const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28704942-6968b84373f0d7bd37bb26e4e';

export const fetchSearchImages = query => {
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
};
