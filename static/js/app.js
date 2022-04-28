

// function that populates the metadata
function demoInfo(sample)
{
    //console.log(sample)

     // use D3.json to get data
     d3.json("samples.json").then((data) => {
        // grab the metadata
        let metaData = data.metadata;
        
        // console.log(metaData);

        // filter off sample value
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        // console.log(result);

        // access index 0 from resulting array
        let resultData = result[0];
        // console.log(resultData);

        // clear the previous data from panel
        d3.select("#sample-metadata").html("");

        // use Object.entries to get value key pairs
        Object.entries(resultData).forEach(([key, value]) =>{
            // add to the sample / demographic data panel
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}

// function that populates the bar chart
function buildBarChart(sample)
{
    // console.log(sample);
    // let data = d3.json("samples.json");
    // console.log(data);

    d3.json("samples.json").then((data) => {
        // grab the sample data
        let sampleData = data.samples;

        // filter off sample value
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from resulting array
        let resultData = result[0];

        // Get otu_ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // build the bar chart
        // get the y ticks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0, 10);

        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Bellybutton Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);

    });
}

// function to build bubble chart
function buildBubbleChart(sample)
{
    d3.json("samples.json").then((data) => {
        // grab the sample data
        let sampleData = data.samples;

        // filter off sample value
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from resulting array
        let resultData = result[0];

        // Get otu_ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // build the bubble chart

        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let layout = {
            title: "Bacteria Cultures in Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);

    }); 
}

// function to initialize the dashboard
function initialize()
{
    
    // let data = d3.json("samples.json");
    // console.log(data);
    
    // access the dropdown selector from the index.html file
    var select = d3.select("#selDataset");

    // use D3.json to get data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names; // array of just the names
        //console.log(sampleNames);

        // use a for each in order to create options for each sample in the array
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });    
        
        // when initialized, pass in the info for the first sample
        let sample1 = sampleNames[0];

        // call the function to build the metadata
        demoInfo(sample1);
        // call funcion to build the bar chart
        buildBarChart(sample1);
        // call function to build the bubble chart
        buildBubbleChart(sample1);
    });
}

// function that updates the dashboard
function optionChanged(item)
{
    // call the update to the metadata
    demoInfo(item);
    // call funcion to build the bar chart
    buildBarChart(item);
    // call function to build bubble chart
    buildBubbleChart(item);
}

// call the initialize function
initialize();