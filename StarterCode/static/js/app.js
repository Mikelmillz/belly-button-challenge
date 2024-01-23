const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function DrawBargraph(sampleId) {
    console.log(`DrawBargraph(${sampleId})`);

    d3.json(url).then(data => {
        console.log(data);

        let samples = data.samples;
        let resultfilter = samples.filter(s => s.id == sampleId);
        let result = resultfilter[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let yticks = otu_ids.slice(0,15).map(otuId => `OTU ${otuId}`).reverse();

       
        let barData = {
            x: sample_values.slice(0,15).reverse(),
            y: yticks,
            type: 'bar',
            text: otu_labels.slice(0,15).reverse(),
            orientation: 'h'
        };

       
        let barArray = [barData];

      
        let barLayout = {
            title: "Top 10 - Bacteria Cultures Found",
            margin: {t: 100, l: 150}
        };

     
        Plotly.newPlot('bar', barArray, barLayout);
    })
}

function DrawBubblechart(sampleId) {
    console.log(`DrawBubblechart(${sampleId})`);

    d3.json(url).then(data => {
        let sample = data.samples;
        let resultfilter = sample.filter(s => s.id == sampleId);
        let result = resultfilter[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

    
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            }
        }

     
        let bubblescatter = [bubbleData];

 
        let bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            margin: {t: 50},
            hovermode: 'closest',
            xaxis: {title: "OTU ID"},
        };


        Plotly.newPlot('bubble', bubblescatter, bubbleLayout);
    })
}


function ShowMetadata(sampleId) {
    console.log(`ShowMetadata(${sampleId})`);

    d3.json(url).then((data) => {
        let metadata = data.metadata;
        console.log(metadata);


        let result = metadata.filter(meta => meta.id == sampleId)[0];
        let demographicinfo = d3.select('#sample-metadata');


        demographicinfo.html('');


        Object.entries(result).forEach(([key, value]) => {
            demographicinfo.append('h6').text(`${key}: ${value}`);
        });
    });
}

function optionChanged(sampleId) {
    console.log(`optionChanged, new value: ${sampleId}`);

    DrawBargraph(sampleId);
    DrawBubblechart(sampleId);
    DrawGauge(sampleId);
    ShowMetadata(sampleId);
}



function InitDashboard() {
    console.log('InitDashboard');


    let selector = d3.select('#selDataset');

    d3.json(url).then(data => {
        console.log('Here is the data');

        let sampleNames = data.names;
        console.log('Here are the sample names:', sampleNames);


        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i];
            selector.append('option').text(sampleId).property('value', sampleId);
        };


        let initialId = selector.property('value');
        console.log(`initialId = ${initialId}`);

        DrawBargraph(initialId);

        DrawBubblechart(initialId);

        ShowMetadata(initialId);

    });

    


}

InitDashboard();