const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

d3.json(url).then(function(data) {
    console.log('Initital Data: ', data);
    
    init(data);

    d3.selectAll("#selDataset").on("change", function() {
        updatePlotly(data);
        displayMetadata(data);
    });
});

// creates a function to initialize the first set of graphs on the pag
function init(data) {
    // generates the dropdown for IDs
    let dropdown = d3.select('#selDataset');
    let ids = data.names;

    // appends the ids to the list
    dropdown.selectAll("option")
        .data(ids)
        .enter()
        .append("option")
        .text(function(d) {
            return d;
        })
        .attr("value", function(d) {
            return d;
    });

    // displays the metadata
    displayMetadata(data);

    // defaults to the first ID to generate the initial plots 
    let s_data = data.samples[0];
 
    // test to ensure the sample data is presented properly
    console.log('First Sample Data: ', s_data);

    // sets up the data for the horizontal bar graph
    let trace1 = {
        // gets the top 10 sample values for the first entry and sets them up to be graphed using Plotly
        x: Object.values(s_data.sample_values.slice(0,10)).reverse(),
        y: Object.values(s_data.otu_ids.slice(0,10)).reverse().map(item => `OTU ${item}`),
        text: Object.values(s_data.otu_labels.slice(0,10)).reverse(),
        name: "bar",
        type: "bar",
        orientation: "h"
    };

    // Data array
    let bar_data = [trace1];

    // Apply a title to the layout
    let layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", bar_data, layout);

    // sets up the data for the bubble graph
    let trace2 = {
        x: Object.values(s_data.otu_ids),
        y: Object.values(s_data.sample_values),
        text: Object.values(s_data.otu_labels),
        mode: 'markers',
        marker: {
            color: Object.values(s_data.otu_ids),
            size: Object.values(s_data.sample_values)
        }
    }

    // Data array
    let bubble_data = [trace2];

    var bubble_layout = {
        title: 'OTU Sample Values',
        showlegend: false,
        height: 750,
        width: 1200
    };

    Plotly.newPlot('bubble', bubble_data, bubble_layout);
}

// This function is called when a dropdown menu item is selected
function updatePlotly(data) {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let selectedID = dropdownMenu.property("value");
  
    // Initialize arrays
    let samp_values = [];
    let samp_ids = [];
    let samp_labels = []

    for (let i=0; i<data.samples.length; i++) {
        if (selectedID === data.samples[i].id) {
            samp_values = Object.values(data.samples[i].sample_values);
            samp_ids = Object.values(data.samples[i].otu_ids);
            samp_labels = Object.values(data.samples[i].otu_labels);
        }
    }
  
    // Note the extra brackets around 'x' and 'y'
    Plotly.restyle("bar", "x", [samp_values.slice(0,10).reverse()]);
    Plotly.restyle("bar", "y", [samp_ids.slice(0,10).reverse().map(item => `OTU ${item}`)]);
    Plotly.restyle("bar", "text", [samp_labels.slice(0,10).reverse()]);

    Plotly.restyle('bubble', 'x', [samp_ids]);
    Plotly.restyle('bubble', 'y', [samp_values]);
    Plotly.restyle('bubble', 'text', [samp_labels]);
    Plotly.restyle('bubble', 'marker', [{color: samp_ids, size: samp_values}] );
}

function displayMetadata(data) {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let selectedID = dropdownMenu.property("value");    
    // determines the right meta data to load
    let selectedMetadata = data.metadata.find(metadata => metadata.id == selectedID);

    // selects the metadata section and clears it if there is any data
    let meta_section = d3.select('#sample-metadata');
    meta_section.html("");

    // appends the correct meta data to the selected meta data section
    if (selectedMetadata) {
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            meta_section.append("p").text(`${key}: ${value}`);
        });
    }
}