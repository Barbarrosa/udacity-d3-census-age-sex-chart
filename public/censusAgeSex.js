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
                        var filteredCsvString = response.responseText.split("\n").reduce(
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
                        );
                        yearData[year] = d3.csv.parse(filteredCsvString);
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
        var normalizedYearData = {};
        for(var key of Object.keys(yearData)) {
            var newYearRows = {};
            var year = yearData[key];
            for(var row of year) {
                if(/\D/.test(row.age.replace('+','').trim()) || row.age == '999' || row.age.length === 0) {
                    // Skip non-numeric ages, the special "999" age value, and empty records
                    continue;
                }

                row.age = row.age.trim();
                row.total = parseInt(row.total.replace(/,/g,''));
                row.male = parseInt(row.male.replace(/,/g,''));
                row.female = parseInt(row.female.replace(/,/g,''));

                if(row.age in newYearRows) {
                    var existingRowData = newYearRows[row.age];
                    if((row.date || row.month) && existingRowData.dates.indexOf((row.date || row.month)) !== -1) {
                        // If we have unaccounted-for rows, log an error to the console
                        console.error('Found unexpected data for year.', key, row, existingRowData);
                    } else {
                        // Take the average if the data has multiple measurements across the year
                        existingRowData.row.total = parseInt(((existingRowData.row.total * existingRowData.count) + row.total)/(existingRowData.count + 1));
                        existingRowData.row.male = parseInt(((existingRowData.row.male * existingRowData.count) + row.male)/(existingRowData.count + 1));
                        existingRowData.row.female = parseInt(((existingRowData.row.female * existingRowData.count) + row.female)/(existingRowData.count + 1));
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

            // Since all later ages are put into the last age category, add a '+' sign
            // to the last age category if it's not already present.
            var oldestAge = Object.keys(newYearRows).map((d) => +d.replace(/\D/,'')).sort(d3.descending)[0];
            var updatedOldestAge = oldestAge + '+';

            normalizedYearData[key] = [];
            for(var age of Object.keys(newYearRows)) {
                rowData = newYearRows[age];
                if(rowData.row.age == oldestAge) rowData.row.age = updatedOldestAge;
                normalizedYearData[key].push(rowData.row);
            }
        }
        return normalizedYearData;
    }

    fetchCensusData()
        .then((yearData) => drawYears(normalizeData(yearData)))
        .catch((err) => console.log(err));

    function getMaxPopulation(years) {
        var maxPop = 0;
        for(var k of Object.keys(years)) {
            maxPop = Math.max(maxPop, d3.max(years[k], (d) => d.total));
        }
        return maxPop;
    }


    function drawYears(yearData) {
        var years = Object.keys(yearData).sort((a,b) => a - b);

        // Keep the population scale consistent by using the overall max population
        // across all years
        var maxPop = getMaxPopulation(yearData);

        drawYearScale(years[0], years, yearData, maxPop);

        // Draw first year
        draw(yearData[years[0]], years[0], maxPop);
    }

    function playYears(yearsLeft, yearData, maxPop) {
        selectYear(yearsLeft[0], yearData, maxPop);
        setTimeout(() => playYears(yearsLeft.slice(1), yearData, maxPop), 400);
    }

    function selectYear(year, yearData, maxPop) {
        var nextYear = d3.select('.yearSelector td.year-' + year);
        if(nextYear.size() > 0) {
            d3.select('.yearSelector td.selected')
                .classed('selected', false);
            nextYear
                .classed('selected', true);
            draw(yearData[year], year, maxPop);
        }
    }

    function drawYearScale(selectedYear, years, yearData, maxPop) {
        var nestedYears = d3.nest()
            .key((d) => ('' + d).substring(3,4))
            .sortKeys(d3.ascending)
            .entries(years);

        d3.select('#playButton')
            .on('click', (d) => playYears(years, yearData, maxPop));
        d3.select('.yearSelector tbody')
            .selectAll('tr')
                .data(nestedYears)
                .enter().append('tr')
                    .selectAll('td')
                        .data((d) => d.values)
                        .enter().append('td')
                            .attr('class', (d,i) => 
                                ('year-' + d + (d == selectedYear ? ' selected' : ''))
                                + ((((d - (d % 10))/10) % 2 > 0) ? ' alt' : '')
                            )
                            .text((d) => d)
                            .on('click', (d) => selectYear(d, yearData, maxPop));
    }

    var svgHeight = 1200,
        svgWidth = 1200,
        marginX = 75,
        marginTop = 5,
        marginBottom = 100,
        height = svgHeight - (marginTop + marginBottom),
        width = svgWidth - marginX;

    function initChart(){
        var svg = d3.select('svg.mainChart');
        svg.attr('height', svgHeight)
           .attr('width', svgWidth);

        svg.append('defs')
            .append('clipPath')
                .attr('id', 'graph-clip-path')
                .append('rect')
                    .attr('x', marginX/2)
                    .attr('y', marginTop)
                    .attr('width', width)
                    .attr('height', height - 5);

        var chart = svg.append('g')
            .classed('graph', true)
            .attr('transform', 'translate(' + marginX/2 + ',' + marginTop + ')')
            .attr('clip-path', 'url(#graph-clip-path)');

        svg.append('g')
            .classed('x-axis', true)
            .classed('axis', true)
            .attr('transform', 'translate(' + marginX/2 + ',' + (height + marginTop) + ')')
            .append('text')
                .classed('axis-label', true)
                .attr('x', width/2.2)
                .attr('dy', '3em')
                .text('Population');

        svg.append('g')
            .attr('transform', 'translate(' + marginX/2 + ',' + marginTop + ')')
            .classed('y-axis', true)
            .classed('axis', true)
            .append('text')
                .classed('axis-label', true)
                .attr('transform', 'rotate(-90)')
                .attr('x', -height/1.6)
                .attr('dy', '-3em')
                .text('Age (years)');

        chart.append('g')
            .classed('grid', true)
            .attr('transform', 'translate(0,' + height + ')');
    }

    initChart();

    function draw(rows, year, maxPop) {

        var x = d3.scale.linear()
            .domain([0, maxPop])
            .range([0,width]);

        var ageRange = d3.set(rows.map((r) => r.age).sort(d3.descending)).values();
        var maxAge = ageRange[ageRange.length - 1];
        var maxAgeNumber = parseInt(maxAge.replace(/\D/g,''));
        var minBirthYear = year - maxAgeNumber;
        var y = d3.scale.ordinal()
            .domain(ageRange)
            .rangeBands([height,0], .2);

        var barWidth = y.rangeBand();

        var svg = d3.select('svg.mainChart');
        var chart = svg.select('g.graph');

        var bars = chart.selectAll('g.bar')
            .data(rows, (d) => (d.year - parseInt(d.age.replace(/\D/g,''))));

        var enterBars = bars.enter().append('g')
            .classed('bar', true);

        var exitBars = bars.exit();

        var barHeight = (y(0) - y(1));
        exitBars
            .transition()
            .duration(1000)
            .ease('sin-in-out')
            .selectAll('rect')
            .attr('y', (d) => {
                var newAge = parseInt(d.age.replace(/\D/g,'')) + (year - d.year);
                if(newAge <= 0)
                {
                    return y(0) + (-newAge * barHeight);
                } else {
                    return y(maxAge) - ((newAge - maxAgeNumber) * barHeight);
                }
            });

        var popFormat = d3.format('0,000');
        enterBars.append('title');

        enterBars.append('rect')
            .classed('total', true)
            .transition()
            .duration(1000)
            .attr('width', (d) => x(+d.total))
            .attr('y', (d) => y(d.age));

        enterBars.append('rect')
            .classed('male', true)
            .transition()
            .duration(1000)
            .attr('width', (d) => x(+d.male))
            .attr('y', (d) => y(d.age));

        enterBars.append('rect')
            .classed('female', true)
            .transition()
            .duration(1000)
            .attr('width', (d) => x(+d.female))
            .attr('y', (d) => y(d.age));

        var updateBars = bars
            .transition()
            .duration(1000)
            .ease('sin-in-out');

        bars.select('title')
            .text((d) => 
                "Born: " + (d.age.indexOf('+') === -1 ? '' : 'Before or at ' )
                    + (d.year - parseInt(d.age.replace(/\D/g,'')))
                + "\nAge: " + d.age
                + "\nTotal: " + popFormat(d.total)
                + "\nMale: " + popFormat(d.male)
                + "\nFemale: " + popFormat(d.female)
                );
                
        updateBars.select('rect.total')
                .attr('height', barWidth)
                .attr('width', (d) => x(+d.total))
                .attr('y', (d) => y(d.age));

        updateBars.select('rect.male')
                .attr('height', barWidth/2)
                .attr('width', (d) => x(+d.male))
                .attr('y', (d) => y(d.age));

        updateBars.select('rect.female')
                .attr('height', barWidth/2)
                .attr('width', (d) => x(+d.female))
                .attr('y', (d) => y(d.age) + barWidth/2);

        var xAxis = d3.svg.axis()
            .orient('bottom')
            .tickFormat(d3.format('.2s'))
            .scale(x);
        var yAxis = d3.svg.axis()
            .orient('left')
            .scale(y);

        svg.select('g.x-axis')
            .transition()
            .duration(1000)
            .ease('sin-in-out')
            .call(xAxis)

        svg.select('g.y-axis')
            .transition()
            .duration(1000)
            .ease('sin-in-out')
            .call(yAxis);
        
        chart.select('g.grid')
            .transition()
            .duration(1000)
            .ease('sin-in-out')
            .call(
                d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .ticks(9)
                    .tickSize(-width, 0, 0)
                    .tickFormat('')
                );

    };
}());
