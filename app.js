function forceGraph() {
    var margin = { top: 20, bottom: 20, left: 20, right: 20 },
        width = 1600 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom,
        tooltip = d3.select('body').append('div').classed('tooltip', true);

    function chart(selection) {
        selection.each(function(data) {

            var force = d3.layout.force()
                .size([width, height])
                .nodes(data.nodes)
                .links(data.links)
                .linkDistance(100)
                .charge(-240);

            var links = d3.select(this).append('svg')
                .attr({
                    'width': width,
                    'height': height
                })
                .classed('links', true)
                .selectAll('.link')
                .data(data.links)
                .enter()
                .append("line")
                .classed("link", true);

            var nodes = d3.select(this)
                .append('div')
                .attr({
                    'width': width,
                    'height': height
                })
                .classed('flags', true)
                .selectAll('.flag')
                .data(data.nodes)
                .enter()
                .append('div')
                .attr({
                    'class': function(d) {
                        return `flag flag-${d.code}`
                    }
                })
                .on('mouseover', function(d) {
                  tooltip.style({
                    opacity: 1,
                    top: (d3.event.pageY + 15) + 'px',
                    left: (d3.event.pageX + 15) + 'px'
                  })
                  .html(`<p>${d.country}</p>`)
                })
                .on('mouseout', function() {
                  tooltip.style('opacity', 0)
                })
                .call(force.drag);

            force.on('tick', function() {

                nodes.style('left', function(d) {
                        return d.x + 'px';
                    })
                    .style('top', function(d) {
                        return (d.y - 5) + 'px';
                    });

                links.attr('x1', function(d) {
                        return d.source.x;
                    })
                    .attr('y1', function(d) {
                        return d.source.y;
                    })
                    .attr('x2', function(d) {
                        return d.target.x;
                    })
                    .attr('y2', function(d) {
                        return d.target.y;
                    });

            });

            force.start();
        });
    }

    chart.width = function(_) {
        if (!arguments.length) {
            return width; }
        width = _ - margin.left - margin.right;
        return chart;
    };
    chart.height = function(_) {
        if (!arguments.length) {
            return height; }
        height = _ - margin.top - margin.bottom;
        return chart;
    };
    return chart;
}

window.onload = function() {
    d3.json('./countries.json', function(error, data) {
        if (error) {
            throw error; }

        var chart = d3.select('body'),
            width = chart.style("width").replace(/px/, ''),
            height = width * 0.5;

        var countryGraph = forceGraph().width(width).height(height);
        d3.select("#chart").datum(data).call(countryGraph);
    })
}
