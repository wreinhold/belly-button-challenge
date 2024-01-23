# belly-button-challenge

In this challenge, I was tasked to create a dashboard of sorts using data from a website on Belly Button Biodiversity, which catalogs the microbes that colonize human navels. The sample data is included in the files, but I used JavaScript to access the JSON data from the website. All of my code can be found in the Static => JS => app.js file. 

In this, I built several functions. First, I used JS to create an initial load of the site. This created two main plots utilizing Plotly, a drop down menu with IDs to select from, and a metadata section. 

The dropdown was generated from the names section of the data. The user is able to pick what data they would like to view. This changes the metadata shown. It also alters both of the graphs.

The first graph is a horizontal bar graph that selected the top ten values of the sample values section of the data. 

The second is a bubble graph that shows all of the sample values for the selected ID.
