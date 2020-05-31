'use strict';

import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import weatherTemplate from '../templates/weather_forecast-template.hbs';
import apiServiceOneDay from '../js/services/apiServiceOneDay.js';
import { fetchImage } from '../js/services/apiWeatherImage.js';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, error } from '@pnotify/core/dist/PNotify';
import '@pnotify/core/dist/PNotify.css';
import 'material-design-icons/iconfont/material-icons.css';
import _ from 'lodash';

const refs = {
  input: document.getElementById('search-input'),
  currentWeather: document.getElementById('weather-info-js'),
  bodyImg: document.querySelector('body'),
};

refs.input.addEventListener('input', _.debounce(handleInputValue, 1500));
refs.currentWeather.style.display = 'none';
weatherImageBackground();

function handleInputValue(e) {
  e.preventDefault();
  clearMarkup();
  const searchQuery = e.target.value;
  apiServiceOneDay.searchQuery = searchQuery;
  e.target.value = '';
  createWeatherTemplate();
  weatherImageBackground();
}

function createWeatherTemplate() {
  apiServiceOneDay
    .fetchCountury()
    .then(response => {
      if (response.cod === '404') {
        refs.currentWeather.style.display = 'none';
        error('No such city found');
      } else {
        const dataTemp = { ...response };
        const countryName = dataTemp.name;
        const sysCountry = dataTemp.sys.country;
        const iconSrc = dataTemp.weather[0].icon;
        const mainTemp = Math.round(dataTemp.main.temp);
        const mainTempMin = Math.round(dataTemp.main.temp_min);
        const mainTempMax = Math.round(dataTemp.main.temp_max);
        return {
          countryName,
          mainTemp,
          iconSrc,
          sysCountry,
          mainTempMin,
          mainTempMax,
        };
      }
    })

    .then(buildWeatherItemsMarkup)
    .catch(error => {
      alert('Somthing bad happend');
      console.warn(error);
    });
}

function buildWeatherItemsMarkup(items) {
  if (items === undefined) {
    return;
  } else {
    refs.currentWeather.style.display = 'flex';
    const markup = weatherTemplate(items);
    refs.currentWeather.insertAdjacentHTML('beforeend', markup);
  }
}
function clearMarkup() {
  refs.currentWeather.innerHTML = '';
}

function weatherImageBackground() {
  let searchQuery = apiServiceOneDay.searchQuery;
  fetchImage(searchQuery).then(channgeBodyImage);
}

function channgeBodyImage(item) {
  if (item === undefined) {
    return;
  }
  refs.bodyImg.style.backgroundImage = `url("${item.largeImageURL}")`;
}
