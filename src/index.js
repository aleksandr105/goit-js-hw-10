import './css/styles.css';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  infoEl: document.querySelector('.country-info'),
  countryListEl: document.querySelector('.country-list'),
};

refs.inputEl.addEventListener('input', debounce(countrySearch, DEBOUNCE_DELAY));

function countrySearch(e) {
  const name = e.target.value.trim();

  if (name.length === 0) {
    refs.countryListEl.innerHTML = '';
    return;
  }

  fetchCountries(name)
    .then(response => {
      if (response.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (response.length <= 10) {
        refs.countryListEl.innerHTML = onRander(response);
      } else {
        refs.countryListEl.innerHTML = '';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(`❌ Oops, there is no country with that name`);
    });
}

function onRander(countries) {
  if (countries.length <= 10 && countries.length !== 1) {
    return countries
      .map(
        ({ name, capital, population, flags, languages }) => `<li class="country-item">
        <div class="country-title">
          <img
            class="flag"
            src="${flags.svg}"
            alt="Флаг страны"
            width="50"
            height="30"
          />
          <h2 class="country-title">${name.official}</h2>
        </div>
      </li>`,
      )
      .join('');
  } else if (countries.length === 1) {
    return countries
      .map(
        ({ name, capital, population, flags, languages }) => `<li class="country-item">
        <div class="country-title">
          <img
            class="flag"
            src="${flags.svg}"
            alt="Флаг страны"
            width="50"
            height="30"
          />
          <h2 class="country-title">${name.official}</h2>
        </div>
        <div class="country-info">
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p>
        </div>
      </li>`,
      )
      .join('');
  }
}
