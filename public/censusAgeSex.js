(function(){

    function fetchCensusData() {
        var dataPromise = new Promise(function(resolve, reject){
            var yearData = {};
            var setsFinished = 0, expectedSetstoFinish = 101;

            function dataLoaded(err) {
                setsFinished += 1;

                if(err) reject(err);
                else if(setsFinished === expectedSetstoFinish) resolve(yearData);
            }

            d3.json('./data/catalog.json', function(yearSets){
                var pre1980 = yearSets['pre-1980'];
                var the1980s = yearSets['1980s'];
                var post1989 = yearSets['post-1989'];

                Object.keys(pre1980).forEach(function(year) {
                    d3.xhr('./data/' + pre1980[year], function(err, response) {
                        if(err) {
                            console.error('Could not load CSV data for', year, err);
                            dataLoaded(err);
                            return;
                        }
                        yearData[year] = d3.csv.parse(
                            response.responseText.split("\n").reduce(
                                function(initial, line){
                                    // Filter for lines that contain data
                                    if(line.length > 0 && /^\d+\+?,/.test(line)) {
                                        return initial + "\n" + line;
                                    } else {
                                        return initial;
                                    }
                                },
                                // Update headers to a usable format
                                'age,total,male,female,'
                                + 'white_total,white_male,white_female,'
                                + 'nonwhite_total,nonwhite_male,nonwhite_female'
                            )
                        );
                        dataLoaded();
                    });
                });

                Object.keys(the1980s).forEach(function(year) {
                    JSZipUtils.getBinaryContent('./data/' + the1980s[year], function(err, data) {
                        if(err) {
                            console.error('Could not load CSV data for', year, err);
                            dataLoaded(err);
                            return;
                        }
                        var zip = new JSZip();
                        zip.loadAsync(data).then(
                            (zipData) => {
                                for(var fileName of Object.keys(zipData.files)) {
                                    var file = zipData.files[fileName];
                                    file.async('string').then(
                                        (content) => {
                                            yearData[year] = [];
                                            for(var line of content.split("\n")) {
                                                yearData[year].push({
                                                    'series': line.substring(0,2),
                                                    'month': line.substring(2,4),
                                                    'year': line.substring(4,6),

                                                    'age': line.substring(6,9),
                                                    'total': line.substring(10,20),
                                                    'male': line.substring(20,30),
                                                    'female': line.substring(30,40),

                                                    'white_male': line.substring(40,50),
                                                    'white_female': line.substring(50,60),
                                                    'black_male_population': line.substring(60,70),
                                                    'black_female_population': line.substring(70,80),
                                                    'american_indian,_eskimo,_and_aleut_male_population': line.substring(80,90),
                                                    'american_indian,_eskimo,_and_aleut_female_population': line.substring(90,100),
                                                    'asian_and_pacific_islander_male_population': line.substring(100,110),
                                                    'asian_and_pacific_islander_female_population': line.substring(110,120),
                                                    'hispanic_male_population': line.substring(120,130),
                                                    'hispanic_female_population': line.substring(130,140),
                                                    'white,_nonhispanic_male_population': line.substring(140,150),
                                                    'white,_nonhispanic_female_population': line.substring(150,160),
                                                    'black,_nonhispanic_male_population': line.substring(160,170),
                                                    'black,_nonhispanic_female_population': line.substring(170,180),
                                                    'american_indian,_eskimo,_and_aleut,_nonhispanic_male_population': line.substring(180,190),
                                                    'american_indian,_eskimo,_and_aleut,_nonhispanic_female_population': line.substring(190,200),
                                                    'asian_and_pacific_islander,_nonhispanic_male_population': line.substring(200,210),
                                                    'asian_and_pacific_islander,_nonhispanic_female_population': line.substring(210,220),
                                                });
                                            }
                                        },
                                        (err) => {
                                            console.error('There was a problem getting ZIP file content for year', year, err);
                                        }
                                    )
                                }
                                dataLoaded();
                            }
                        );
                    });
                });

                Object.keys(post1989).forEach(function(year) {
                    d3.xhr('./data/' + post1989[year], function(err, response) {
                        if(err) {
                            console.error('Could not load CSV data for', year, err);
                            dataLoaded(err);
                            return;
                        }
                        yearData[year] = d3.csv.parse(
                            response.responseText.split("\n").reduce(
                                function(initial, line){
                                    // Filter for lines that contain data
                                    if(line.length > 0 && /^"\w+/.test(line)) {
                                        return initial + "\n" + line;
                                    } else {
                                        return initial;
                                    }
                                },
                                // Update headers to a usable format
                                'date,age,total,male,female'
                            )
                        );
                        dataLoaded();
                    });
                });
            });
        });
        return dataPromise;
    }

    function normalizeData(yearData) {
        var normalizedYearData = [];
        for(var key of Object.keys(yearData)) {
            var newYearRows = {};
            var year = yearData[key];
            for(var row of year) {
                if(/\D/.test(row.age) || row.age == '999' || row.age.length === 0) {
                    // Skip non-numeric ages, the special "999" age value, and empty records
                    continue;
                }

                row.age = parseInt(row.age);
                row.total = parseInt(row.total);
                row.male = parseInt(row.male);
                row.female = parseInt(row.female);

                if(row.age in newYearRows) {
                    var existingRowData = newYearRows[row.age];
                    if((row.date || row.month) && existingRowData.dates.indexOf((row.date || row.month)) !== -1) {
                        // If we have unaccounted-for rows, log an error to the console
                        console.error('Found unexpected data for year.', key, row, existingRowData);
                    } else {
                        // Take the average if the data has multiple measurements across the year
                        existingRowData.row.total = ((existingRowData.row.total * existingRowData.count) + row.total)/(existingRowData.count + 1);
                        existingRowData.row.male = ((existingRowData.row.male * existingRowData.count) + row.male)/(existingRowData.count + 1);
                        existingRowData.row.female = ((existingRowData.row.female * existingRowData.count) + row.female)/(existingRowData.count + 1);
                        existingRowData.dates.push(row.date || ((row.month && row.year) ? (row.month + '-' + row.year) : null));
                        existingRowData.rowsUsed.push(row);
                    }
                } else {
                    // Normalize row data for charting, categorizing rows into appropriate buckets b/c of oldest age limitations
                    var yearNumber = parseInt(key);
                    var yearBucket;

                    if(yearNumber < 1980) yearBucket = 1900;
                    else if(yearNumber < 1990) yearBucket = 1980;
                    else yearBucket = 1990;

                    newYearRows[row.age] = {
                        rowsUsed: [
                            row
                        ],
                        dates: [
                            row.date || ((row.month && row.year) ? (row.month + '-' + row.year) : null)
                        ],
                        row: {
                            bucket: yearBucket,
                            year: key,
                            age: row.age,
                            total: row.total,
                            male: row.male,
                            female: row.female
                        },
                        count: 1
                    };
                }
            }

            for(var age of Object.keys(newYearRows)) {
                rowData = newYearRows[age];
                normalizedYearData.push(rowData.row);
            }
        }
        return normalizedYearData;
    }

    fetchCensusData()
        .then((yearData) => draw(normalizeData(yearData)))
        .catch((err) => console.log(err));

    function draw(rows) {
        var svgHeight = 500;
            svgWidth = 1200;
            marginX = 200;
            marginY = 70;
            height = svgHeight - marginX,
            width = svgWidth - marginY;

        var y = d3.scale.linear()
            .domain([d3.min(rows, (d) => Math.min(d.male,d.female)), d3.max(rows, (d) => Math.max(d.male,d.female))])
            .range([height,0]);

        var x = d3.scale.ordinal()
            .domain(d3.set(rows.map((r) => r.age).sort((v,v2) => v - v2)).values())
            .rangeBands([0,width], .05);

        var barWidth = x.rangeBand();

        var svg = d3.select('svg');
        svg.attr('height', svgHeight)
           .attr('width', svgWidth);
        var chart = svg.append('g')
            .attr('transform', 'translate(' + marginX/2 + ',' + marginY/2 + ')');

        chart.selectAll('rect.male')
            .data(rows)
            .enter().append('rect')
                .classed('male', true)
                .attr('width', barWidth)
                .attr('height', (d) => height - y(+d.male))
                .attr('x', (d) => x(+d.age))
                .attr('y', (d) => y(+d.male));

        chart.selectAll('rect.female')
            .data(rows)
            .enter().append('rect')
                .classed('female', true)
                .attr('width', barWidth)
                .attr('height', (d) => height - y(+d.female))
                .attr('x', (d) => x(+d.age))
                .attr('y', (d) => y(+d.female));

        var xAxis = d3.svg.axis()
            .orient('bottom')
            .tickFormat(d3.format('.0'))
            .scale(x);
        var yAxis = d3.svg.axis()
            .orient('left')
            .tickFormat(d3.format('.2s'))
            .scale(y);

        svg.append('g')
            .attr('transform', 'translate(' + marginX/2 + ',' + (height + marginY/2) + ')')
            .call(xAxis);

        svg.append('g')
            .attr('transform', 'translate(' + marginX/2 + ',' + marginY/2 + ')')
            .call(yAxis)
                .attr('class', 'axis')
                .append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', width/50)
                    .attr('x', -height/2.7)
                    .text('population (in millions)');

    };
}());
