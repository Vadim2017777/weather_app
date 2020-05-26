'use strict';
import '../styles/styles.css';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';
import weatherTemplate from '../templates/weather_forecast-template.hbs';
import apiServiceOneDay from './services/apiServiceOneDay.js';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, error } from '@pnotify/core/dist/PNotify';
import '@pnotify/core/dist/PNotify.css';
import 'material-design-icons/iconfont/material-icons.css';
import _ from 'lodash';

const refs = {
  input: document.getElementById('search-input'),
  currentWeather: document.getElementById('weather-info-js'),
  weatherMainTemp: document.querySelector('.weather-main-temp__sp'),
  buttonOneDay: document.querySelector('[data-action="oneDaysForcast"]'),
  buttonFiveDay: document.querySelector('[data-action="5daysForcast"]'),
};

refs.input.addEventListener('input', _.debounce(handleInputValue, 1000));
refs.currentWeather.style.display = 'none';
refs.buttonFiveDay.addEventListener('click', handleButtonClickFiveDays);

function handleInputValue(e) {
  e.preventDefault();
  clearMarkup();

  const searchQuery = e.target.value;
  apiServiceOneDay.searchQuery = searchQuery;
  e.target.value = '';
  createWeatherTemplate();
  refs.buttonOneDay.classList.add('unactive');
}

function createWeatherTemplate() {
  apiServiceOneDay
    .fetchImages()
    .then(buildWeatherItemsMarkup)
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

function handleButtonClickFiveDays() {
  refs.currentWeather.style.display = 'none';
  createFiveDayWeatherTemplate();
  console.log(apiServiceOneDay.searchQuery);
}
