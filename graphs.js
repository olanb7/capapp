
var socket = io.connect('http://olanb.eu:4001');

var w = 20, h = 40, hpad = 10, width = 600;

var labellist = ['C', 'U', 'R', 'B', '65'];

function viewport() {
    var e = window,
        a = 'inner';

    if ( !( 'innerWidth' in window ) ) {
        a = 'client';
        e = document.documentElement || document.body;
    }

    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}


width = viewport().width - (20 * 4);

socket.on('updates', function(data) {

    height = 40 * data.length;

    console.log('updates');

    // Generate a random color
    var newColor = 'rgb(' + Math.floor(255 * Math.random()) +
               ', ' + Math.floor(255 * Math.random()) +
               ', ' + Math.floor(255 * Math.random()) + ')';

    var x = d3.scale.linear()
              .domain([0, d3.max(data)])
              .range([0, width]);

    d3.select('#curb').selectAll('rect').data(data)
         .transition().duration(200).delay(50)
         .attr('width', x)
         .attr('fill', newColor);

     d3.select('#curb').selectAll('.score').data(data)
         .text(function(d) { return d; })
         .attr('x', x)
         .attr('dx', -3);
});


socket.on('initial', function(data) {

    height = 40 * data.length;

    console.log('initial');
    console.log(data);

    var x = d3.scale.linear()
              .domain([0, d3.max(data)])
              .range([0, width]);

    var y = d3.scale.ordinal()
              .domain([0,1,2,3,4,5])
              .rangeBands([0, height], 0.1);

    var vis = d3.select('#curb')
                .append('svg:svg')
                .attr('width', width + 40)
                .attr('height', height + 100)
                .append('svg:g')
                .attr('transform', 'translate(20,0)');

    var bars = vis.selectAll('g.bar')
                    .data(data)
                    .enter().append('svg:g')
                    .attr('class', 'bar')
                    .attr('transform', function(d, i) {
                        console.log(i + '(' + d + ') -> ' + y(i));
                        return 'translate(20,' + y(i) + ')';
                    });

            bars.append('svg:rect')
                .attr('fill', 'rgb(7, 130, 180)')   //Alternate colors
                .attr('width', x)
                .attr('height', y.rangeBand());

            bars.append('svg:text')
                .attr('x', 0)
                .attr('y', 10 + y.rangeBand() / 2)
                .attr('dx', -6)
                .attr('text-anchor', 'end')
                .text(function(d, i) { return labellist[i]; });

            bars.append('svg:text')
                .data(data)
                .attr('class', 'score')
                .attr('x', x)
                .attr('y', 10 + y.rangeBand() / 2)
                .attr('dx', -6)
                .attr('text-anchor', 'end')
                .text(function(d, i) { return d; });

});
