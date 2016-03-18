'use strict';

//set namespace if it doesn't exist
this['CC'] = this['CC'] || {};

CC.init = function (){
    this.setupGraph();
    this.loadData();
};

CC.setupGraph = function (){
    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    this.width = 960 - margin.left - margin.right,
    this.height = 500 - margin.top - margin.bottom;

    this.x = d3.time.scale()
        .range([0, this.width]);

    this.y = d3.scale.linear()
        .range([this.height, 0]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient('bottom');

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient('left');

    this.area = d3.svg.area()
        .x(function (d) { return CC.x(d.date); })
        .y0(function (d) { return CC.y(d.tmin); })
        .y1(function (d) { return CC.y(d.tmax); });

    this.svg = d3.select('body').append('svg')
        .attr('width', this.width + margin.left + margin.right)
        .attr('height', this.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

};


CC.loadData = function (){
    var parseDate = d3.time.format('%Y%m%d').parse;

    d3.csv('data/stations/USW00014922.csv')
        //parse data
        .row(function (d) {
            d.tavg = d['DLY-TAVG-NORMAL'] * 0.1;
            d.tmax = d['DLY-TMAX-NORMAL'] * 0.1;
            d.tmin = d['DLY-TMIN-NORMAL'] * 0.1;
            d.date = parseDate(d['DATE']);
            d.loc = [+d.LATITUDE, +d.LONGITUDE];
            return d;
        })
        //do stuff with it
        .get(function (error, rows) {
            CC.x.domain(d3.extent(rows, function (d) { return d.date; }));
            CC.y.domain([d3.min(rows, function (d) { return d.tmin; }), d3.max(rows, function (d) { return d.tmax; })]);


            CC.svg.append('path')
                .datum(rows)
                .attr('class', 'area')
                .attr('d', CC.area);

            CC.svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + CC.height + ')')
                .call(CC.xAxis);

            CC.svg.append('g')
                    .attr('class', 'y axis')
                    .call(CC.yAxis);
              //   .append('text')
              //       .attr('transform', 'rotate(-90)')
              // .attr('y', 6)
              // .attr('dy', '.71em')
              // .style('text-anchor', 'end')
              // .text('Temperature (ºF)');

            //console.log(rows);
        });
};

CC.init();
