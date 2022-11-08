import './css/styles.css';
import { fetchCountries } from '../src/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

// console.log(Notify.failure('Oops, there is no country with that name'))

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countriesListEl: document.querySelector('.country-list'),
  infoAboutCountryEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'keydown',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);

/**function */

function onSearchCountry(evt) {
  evt.preventDefault();

  if (evt.target.value.length === 1) {
    Notify.warning(
      'Too many matches found. Please enter a more specific name',
      {
        timeout: 5000,
      }
    );
    return;
  } else if (evt.target.value.length === 0) {
    Notify.info('Please start entering some country for searching', {
      timeout: 5000,
    });
    refs.inputEl.removeEventListener('keydown', evt);
    return;
  }

  fetchCountries(evt.target.value)
    .then(onRenderCountriesList)
    .catch(error => console.log(error));
}

function onRenderCountriesList(countries) {
  console.log('🚀 ~ countries', countries);
  const numberCountriesFound = countries.length;
  const markupCountriesList = countries.map(
    country =>
      `<li><img src="${country.flags.svg}"
      alt="Flag of country ${country.name.official}" />
      <h1>${country.name.official}</h1></li>`
  );
  refs.countriesListEl.innerHTML = markupCountriesList;

  if (numberCountriesFound === 1) {
    const markupInfoAboutCountry = countries.map(
      country =>
        `<p><b>Capital: </b>${country.capital}</p>
         <p><b>Population: </b>${country.population}</p>
         <p><b>Languages: </b>${country.languages}</p>`
    );
    refs.infoAboutCountryEl.innerHTML = markupInfoAboutCountry;
  }
}
