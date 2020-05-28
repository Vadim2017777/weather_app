'use strict';
import '../styles/styles.css';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import weatherTemplate from '../templates/weather_forecast-template.hbs';
import apiServiceOneDay from './services/apiServiceOneDay.js';
import { fetchImage } from './services/apiWeatherImage.js';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, error } from '@pnotify/core/dist/PNotify';
import '@pnotify/core/dist/PNotify.css';
import 'material-design-icons/iconfont/material-icons.css';
import _ from 'lodash';

const refs = {
  input: document.getElementById('search-input'),
  currentWeather: document.getElementById('weather-info-js'),
  weatherMainTemp: document.querySelector('.weather-info'),

  bodyImg: document.querySelector('body'),
};

refs.input.addEventListener('input', _.debounce(handleInputValue, 1000));
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
    .fetchImages()
    .then(buildWeatherItemsMarkup)
    .then(console.dir(refs.weatherMainTemp.childNodes))
    .catch(error => {
      alert('Somthing bad happend');
      console.warn(error);
    });
}

function buildWeatherItemsMarkup(items) {
  console.log(items);
  if (items.cod != '404') {
    refs.currentWeather.style.display = 'flex';
    const markup = weatherTemplate(items);
    refs.currentWeather.insertAdjacentHTML('beforeend', markup);
  } else {
    refs.currentWeather.style.display = 'none';
    error('No such image found');
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
  refs.bodyImg.style.backgroundImage = `url("${item.largeImageURL}")`;
  console.log(item.largeImageURL);
}
