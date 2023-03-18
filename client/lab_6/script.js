
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
  console.log('fired injectHTML')
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str
  })
} 

function cutRestaurantList(list) {

  console.log('fired cut list');
  const range = [...Array(15).keys()];
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index]
  })

}


/* A quick filter that will return something based on a matching input */
function filterList(list, query) {

  return list.filter( (item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery)

  })
  
}

async function mainEvent() {
  /*
    ## Main Event
      Separating your main programming from your side functions will help you organize your thoughts
      When you're not working in a heavily-commented "learning" file, this also is more legible
      If you separate your work, when one piece is complete, you can save it and trust it
  */

  // the async keyword means we can make API requests
  const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
  const submit = document.querySelector('button[type="submit"]'); // get a reference to your submit button
  submit.style.display = 'none'; // let your submit button disappear

  /*
    Let's get some data from the API - it will take a second or two to load
    This next line goes to the request for 'GET' in the file at /server/routes/foodServiceRoutes.js
    It's at about line 27 - go have a look and see what we're retrieving and sending back.
   */
  const results = await fetch('/api/foodServicesPG');
  const arrayFromJson = await results.json(); // here is where we get the data from our request as JSON

  /*
    Below this comment, we log out a table of all the results using "dot notation"
    An alternate notation would be "bracket notation" - arrayFromJson["data"]
    Dot notation is preferred in JS unless you have a good reason to use brackets
    The 'data' key, which we set at line 38 in foodServiceRoutes.js, contains all 1,000 records we need
  */
  console.table(arrayFromJson.data);

  // in your browser console, try expanding this object to see what fields are available to work with
  // for example: arrayFromJson.data[0].name, etc
  console.log(arrayFromJson.data[0]);

  // this is called "string interpolation" and is how we build large text blocks with variables
  console.log(`${arrayFromJson.data[0].name} ${arrayFromJson.data[0].category}`);

  // This IF statement ensures we can't do anything if we don't have information yet
  if (arrayFromJson.data?.length > 0) { // the question mark in this means "if this is set at all"
    submit.style.display = 'block'; // let's turn the submit button back on by setting it to display as a block when we have data available

    // And here's an eventListener! It's listening for a "submit" button specifically being clicked
    // this is a synchronous event event, because we already did our async request above, and waited for it to resolve
    form.addEventListener('submit', (submitEvent) => {
      // This is needed to stop our page from changing to a new URL even though it heard a GET request
      submitEvent.preventDefault();

      // This constant will have the value of your 15-restaurant collection when it processes
      const restaurantList = processRestaurants(arrayFromJson.data);

      // And this function call will perform the "side effect" of injecting the HTML list for you
      injectHTML(restaurantList);

      // By separating the functions, we open the possibility of regenerating the list
      // without having to retrieve fresh data every time
      // We also have access to some form values, so we could filter the list based on name
    });
  }
}


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
