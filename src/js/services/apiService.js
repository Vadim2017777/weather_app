const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';

export default {
  API_KEY: 'e6a412f77abd301d1f3f9864e669e17e',

  query: '',
  fetchImages() {
    const requestParams = `q=${this.query}&appid=${this.API_KEY}`;

    return fetch(baseUrl + requestParams)
      .then(response => {
        return response.json();
      })

      .catch(error => {
        throw error;
      });
  },

  set searchQuery(string) {
    this.query = string;
  },
};
