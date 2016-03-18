'use strict';

//set namespace if it doesn't exist
this['CC'] = this['CC'] || {
    doneSetup: false
};


CC.init = function (){
    this.bindEvents();
};

CC.bindEvents = function (){
    $('.select-city').on('change', CC.updateGraph);
};

CC.updateGraph = function (event) {
    var $el = $(this);
    var val = $el.find(':selected').val();
    var idx = $el.data('idx');
    if (!val){ return; }
    if (!CC.doneSetup){ CC.setupGraph(); };

    //CC.clearPrevGraph(idx);
    CC.loadData(val, idx);

};

// CC.clearPrevGraph = function (idx){
//     // this.svg.select(".line")   // change the line
//     //         .duration(750)
//     //         .attr("d", valueline(data));
// };

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

    this.tavgLine = d3.svg.line()
        .x(function (d) { return CC.x(d.date); })
        .y(function (d) { return CC.y(d.tavg); });

    this.tminTmaxArea = d3.svg.area()
        .x(function (d) { return CC.x(d.date); })
        .y0(function (d) { return CC.y(d.tmin); })
        .y1(function (d) { return CC.y(d.tmax); });

    this.svg = d3.select('body').append('svg')
        .attr('width', this.width + margin.left + margin.right)
        .attr('height', this.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(this.xAxis);

    this.svg.append('g')
        .attr('class', 'y axis')
        .call(this.yAxis);

    // hard code domain for dates we know all data uses
    this.x.domain([
        this.parseDate('20100101'),
        this.parseDate('20101231')
    ]);
    // hard code temp range
    this.y.domain([
        5,  //d3.min(rows, function (d) { return d.tmin; }),
        95 //d3.max(rows, function (d) { return d.tmax; })
    ]);

    CC.doneSetup = true;
};

CC.parseDate = d3.time.format('%Y%m%d').parse;

CC.loadData = function (stationId, idx){
    //stationId = 'USW00014922';
    var dataFile = 'data/stations/'+stationId+'.csv';

    d3.csv(dataFile)
        //parse data
        .row(function (d) {
            d.tavg = d['DLY-TAVG-NORMAL'] * 0.1;
            d.tmax = d['DLY-TMAX-NORMAL'] * 0.1;
            d.tmin = d['DLY-TMIN-NORMAL'] * 0.1;
            d.date = CC.parseDate(d['DATE']);
            d.loc = [+d.LATITUDE, +d.LONGITUDE];
            return d;
        })
        //do stuff with it
        .get(function (error, data) {
            CC.drawLine(idx, data);
        });
};

CC.drawLine = function (idx, data){
    var svg = d3.select('body').transition();

    var minMaxSel = svg.select('temp-range.min-max-'+idx);
    var avgSel = svg.select('.avg-temp.avg-'+idx);

    if (minMaxSel.empty() && avgSel.empty()) {
        //haven't been drawn yet
        CC.svg.append('path')
            .datum(data)
            .attr('class', 'temp-range min-max-'+idx)
            .attr('data-idx', idx)
            .attr('d', CC.tminTmaxArea);

        CC.svg.append('path')
            .datum(data)
            .attr('class', 'avg-temp avg-'+idx)
            .attr('data-idx', idx)
            .attr('d', CC.tavgLine);
    } else {
        //update existing
        minMaxSel
            .duration(750)
            .datum(data)
            .attr('d', CC.tminTmaxArea);

        avgSel
            .duration(750)
            .datum(data)
            .attr('d', CC.tavgLine);

    }



};

//CC.updateRows()

CC.init();
