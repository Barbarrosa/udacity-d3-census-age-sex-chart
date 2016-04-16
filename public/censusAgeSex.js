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
