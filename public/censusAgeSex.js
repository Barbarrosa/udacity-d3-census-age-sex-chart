(function(){

    d3.json('./data/catalog.json', function(yearSets){
        var pre1980 = yearSets['pre-1980'];
        var the1980s = yearSets['1980s'];
        var post1989 = yearSets['post-1989'];
        var yearData = {};
        Object.keys(pre1980).forEach(function(year) {
            d3.xhr('./data/' + pre1980[year], function(err, response) {
                if(err) {
                    console.error('Could not load CSV data for', year, err);
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
            });
        });

        Object.keys(the1980s).forEach(function(year) {
            JSZipUtils.getBinaryContent('./data/' + the1980s[year], function(err, data) {
                if(err) {
                    console.error('Could not load CSV data for', year, err);
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
                    }
                );
            });
        });
    });
    function draw(rows) {
        var svgHeight = 300;
            svgWidth = 800;
            marginX = 70;
            marginY = 70;
            height = svgHeight - marginX;
            width = svgWidth - marginY;

        var y = d3.scale.linear()
            .domain([])
            .range([height,0]);

        var x = d3.scale.linear()
            .domain([])
            .range([0, width]);

        var svg = d3.select('svg');
        svg.attr('height', svgHeight)
           .attr('width', svgWidth);
        var chart = svg.append('g');
        var rowGroup = chart.selectAll('g')
            .data(rows)
            .enter().append('g')
            .attr('transform', 'translate(' + marginX/2 + ',' + marginY/2 + ')');

        var xAxis = d3.svg.axis()
            .orient('bottom')
            .tickFormat(d3.format('.0'))
            .scale(x);
        var yAxis = d3.svg.axis()
            .orient('left')
            .scale(y);

        svg.append('g')
            .attr('transform', 'translate(' + marginX/2 + ',' + (height + marginY/2) + ')')
            .call(xAxis);
        svg.append('g')
            .attr('transform', 'translate(' + marginX/2 + ',' + marginY/2 + ')')
            .call(yAxis);
    };
}());
