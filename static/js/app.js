// FUNCTION #1 of 5
function buildCharts(selectedPatientID) {
    d3.json("static/data/samples.json").then(data => {
        console.log(data)
        var samples = data.samples
        var filteredSample = samples.filter(sample => sample.id == selectedPatientID)[0]
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(sample => sample.id == selectedPatientID)[0]

        var patientWashingFrequency = filteredMetadata.wfreq
        // ADD APPROXIMATELY 50 LINES OF CODE
        // Bar chart
        // Use sample_values as the values for the bar chart.
        // Use otu_ids as the labels for the bar chart.
        // Use otu_labels as the hovertext for the chart.
        var trace1 = {
            x: filteredSample.sample_values.slice(0, 10).reverse(),
            y: filteredSample.otu_ids.map(otu_id => `OTU #${otu_id}`).reverse(),
            text: filteredSample.otu_labels.slice(0, 10),
            marker: {
                //   color: ['rgba(204,204,204,1)', 'rgba(222,45,38,0.8)', 'rgba(204,204,204,1)', 'rgba(204,204,204,1)', 'rgba(204,204,204,1)']
            },
            type: 'bar',
            orientation: "h"
        };

        var data = [trace1];

        var layout = {
            title: 'Most Common Bacteria'
        };

        Plotly.newPlot('barDiv', data, layout);
        // Bubble Chart
        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.
        var trace1 = {
            x: filteredSample.otu_ids,
            y: filteredSample.sample_values,
            text: filteredSample.otu_labels,
            mode: 'markers',
            marker: {
                color: filteredSample.otu_ids,
                size: filteredSample.sample_values
            }
        };

        var data = [trace1];

        var layout = {
            title: 'Bacterias found on Patients',
            showlegend: false,
            height: 600,
            width: 800,
            xaxis:{
                title:"OTU ID"
            },
            yaxis:{
                title:"Quantity of Bacteria"
            },
        };

        Plotly.newPlot('bubbleDiv', data, layout);

        // Gauge bar
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: patientWashingFrequency,
                title: { text: "Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 400 },
                gauge: { axis: { range: [null, 8] } }
            }
        ];

        var layout = { width: 600, height: 400 };
        Plotly.newPlot('gaugeDiv', data, layout);
    })
};

// FUNCTION #2 of 5
function populateDemographicInfo(selectedPatientID) {
    var demographicInfoBox = d3.select("#sample-metadata");
    demographicInfoBox.html("")
    d3.json("static/data/samples.json").then(data => {
        console.log(data)
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(sample => sample.id == selectedPatientID)[0]
        console.log(filteredMetadata)
        Object.entries(filteredMetadata).forEach(([key, value]) => {
            demographicInfoBox.append("h6").text(`${key}: ${value}`)
        })
    })
}

// FUNCTION #3 of 5
function optionChanged(selectedPatientID) {
    console.log(selectedPatientID);
    buildCharts(selectedPatientID);
    populateDemographicInfo(selectedPatientID);
}

// FUNCTION #4 of 5
function populateDropdown() {
    var dropdown = d3.select("#selDataset")
    d3.json("static/data/samples.json").then(data => {
        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropdown.append("option").text(patientID).property("value", patientID)
        })
    })
}

// FUNCTION #5 of 5
function buildWebsiteOnStartup() {
    populateDropdown();
    d3.json("static/data/samples.json").then(data => {
        buildCharts(data.names[0]);
        populateDemographicInfo(data.names[0]);
    })
};

buildWebsiteOnStartup();