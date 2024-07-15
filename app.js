async function getData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=VUWFR3M79QS7WLLSS4PMP9T7S&contentType=json`,
    { mode: 'cors' }
  );
  const data = await response.json();
  console.log(data);
}
