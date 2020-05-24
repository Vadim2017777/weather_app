'use strict';
import '../styles/styles.css';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';
import weatherTemplate from '../templates/weather_brodcast-template.hbs';
import apiService from './services/apiService.js';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, error } from '@pnotify/core/dist/PNotify';
import '@pnotify/core/dist/PNotify.css';
import 'material-design-icons/iconfont/material-icons.css';
import _ from 'lodash';

const refs = {
  input: document.getElementById('search-input'),
  weather: document.getElementById('weather-info-today-init'),
};

refs.input.addEventListener('input', _.debounce(handleInputValue, 1000));

function handleInputValue(e) {
  e.preventDefault();
  const searchQuery = e.target.value;
  apiService.searchQuery = searchQuery;
  e.target.value = '';
  createWeatherTemplate();
}

function createWeatherTemplate() {
  apiService
    .fetchImages()
    .then(buildWeatherItemsMarkup)
    .catch(error => {
      alert('Somthing bad happend');
      console.warn(error);
    });
}

function buildWeatherItemsMarkup(items) {
  console.log(items);

  const markup = weatherTemplate(items);
  refs.weather.insertAdjacentHTML('beforeend', markup);
  console.log(markup);
}
