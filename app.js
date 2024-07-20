async function getData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=VUWFR3M79QS7WLLSS4PMP9T7S&contentType=json`,
    { mode: 'cors' }
  );
  const data = await response.json();
  return data;
}

let form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  data = await getData(form.querySelector('input').value);
  form.querySelector('input').value = '';
  loadData(data);
});

document.querySelector('.deg').addEventListener('click', async (e) => {
  console.log(document.querySelector('.address').innerText);
  loadData(await getData(document.querySelector('.address').innerText));
});

async function loadDefault() {
  loadData(await getData('tehran'));
}

function loadLocationData() {
  const successCallback = async (position) => {
    let loc = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
    );
    let res = await loc.json();
    loadData(await getData(res.city));
  };

  const errorCallback = (error) => {
    alert('cant access your location! please allow access');
    loadDefault();
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

document
  .querySelector('.locationBtn')
  .addEventListener('click', loadLocationData);

function formatDate(d) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

function updateTime(tz) {
  const now = new Date();
  document.querySelector('.time').innerText = now
    .toLocaleTimeString('en-GB', { timeZone: tz })
    .slice(0, 5);
  document.querySelector('.date').innerText = formatDate(now);
  return parseInt(document.querySelector('.time').innerText.slice(0, 2)) + 1;
}

function setTemp(element, temp) {
  i = document.createElement('i');
  i.classList.add('wi');
  if (document.querySelector('.deg').checked) {
    i.classList.add('wi-fahrenheit');
    function calcTemp(t) {
      return Math.round((t * 9) / 5 + 32);
    }
  } else {
    i.classList.add('wi-celsius');
    function calcTemp(t) {
      return Math.round(t);
    }
  }

  element.innerText = calcTemp(temp);
  element.appendChild(i);
}

function setIcon(element, icon) {
  element.className = '';
  element.classList.add('wi');
  element.classList.add('icon');
  switch (icon) {
    case 'snow':
      element.classList.add('wi-snow');
      break;

    case 'rain':
      element.classList.add('wi-rain');
      break;

    case 'fog':
      element.classList.add('wi-fog');
      break;

    case 'wind':
      element.classList.add('wi-windy');
      break;

    case 'cloudy':
      element.classList.add('wi-cloudy');
      break;

    case 'partly-cloudy-day':
      element.classList.add('wi-day-sunny-overcast');
      break;

    case 'partly-cloudy-night':
      element.classList.add('wi-night-partly-cloudy');
      break;

    case 'clear-day':
      element.classList.add('wi-day-sunny');
      break;

    case 'clear-night':
      element.classList.add('wi-night-clear');
      break;

    default:
      element.classList.add('wi-na');
      break;
  }
}

function loadData(data) {
  document.querySelector('.address').innerText = data.address;
  let time = updateTime(data.timezone);
  setTemp(document.querySelector('.temp'), data.currentConditions.temp);
  setTemp(
    document.querySelector('.feelsLike'),
    data.currentConditions.feelslike
  );
  document.querySelector('.sunrise').innerText =
    data.currentConditions.sunrise.slice(0, 5);

  document.querySelector('.sunset').innerText =
    data.currentConditions.sunset.slice(0, 5);

  setIcon(document.querySelector('.icon'), data.currentConditions.icon);
  document.querySelector('.iconDiscription').innerText =
    data.currentConditions.conditions;

  document.querySelector(
    '.humidity'
  ).innerText = `${data.currentConditions.humidity}%`;
  document.querySelector(
    '.windSpeed'
  ).innerText = `${data.currentConditions.windspeed}km/h`;
  document.querySelector(
    '.pressure'
  ).innerText = `${data.currentConditions.pressure}hpa%`;
  document.querySelector(
    '.uvindex'
  ).innerText = `${data.currentConditions.uvindex}`;

  let daycards = document.querySelectorAll('.dayliCard');
  for (let i = 0; i < 5; i++) {
    day = data.days[i + 1];
    card = daycards[i];
    setIcon(card.querySelector('.icon'), day.icon);
    setTemp(card.querySelector('.fTemp'), day.temp);
    card.querySelector('.fDate').innerText = formatDate(new Date(day.datetime));
  }

  let d = 0;
  let hoursCard = document.querySelectorAll('.hourlyCard');
  for (let i = 0; i < 6; i++) {
    if (time > 23) {
      time = 0;
      d++;
    }
    let hour = data.days[d].hours[time];
    let hourCard = hoursCard[i];
    time++;

    hourCard.querySelector('.hour').innerText = hour.datetime.slice(0, 5);
    setIcon(hourCard.querySelector('.icon'), hour.icon);
    setTemp(hourCard.querySelector('.hourtemp'), hour.temp);

    let winddir = hourCard.querySelector('.wi-wind');
    winddir.className = '';
    winddir.classList.add('wi');
    winddir.classList.add('wi-wind');
    winddir.classList.add(`towards-${Math.round(hour.winddir)}-deg`);

    hourCard.querySelector('.windSpeed').innerText = `${Math.round(
      hour.windspeed
    )}km/h`;
  }
}

loadDefault();
