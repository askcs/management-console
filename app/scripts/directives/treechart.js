define(['directives/directives', 'd3'], function(directives, d3) {
	'use strict';

	directives.directive('treeChart', function(){
		return{
			restrict: 'E',
			scope: {
				data: '=data'
			},
			link: function (scope, element, attr) {
				var m = [20, 20, 50, 120],
	        w = 1100 - m[1] - m[3],
	        h = 980 - m[0] - m[2],
	        i =0,
	        root,
	        vbWidth = attr.vbWidth || 820,
	        vbHeight = attr.vbHeight || 960;

	      var tree = d3.layout.tree()
          .separation(function(a, b) { return a.parent == b.parent ? 1 : 2 })
          .size([h,w]);

        var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });

        var vis = d3.select(element[0]).append('svg:svg')
		      .attr('viewBox', '0 0 ' + vbWidth +  ' ' + vbHeight )
		      .attr('preserveAspectRatio', 'xMinYMin meet')
		        .append('svg:g')
		        .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

		    root = scope.data;
		    root.x0 = h/2;
		    root.y0 = 0;		    

		    /*var zoomListener = d3.behavior.zoom()
		    	.scaleExtent([0.6, 1.1])
		    	.on('zoom', zoomHandler);
				
				function zoomHandler(){
					vis.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
				}	

				zoomListener(vis);*/

		    function toggleAll(d) {
	        if (d.children) {
	          d.children.forEach(toggleAll);
	          toggle(d);
	        }
	      }

	      // Toggle children.
	      function toggle(d) {
	        if (d.children) {
	          d._children = d.children;
	          d.children = null;
	        } else {
	          d.children = d._children;
	          d._children = null;
	        }
	      }

	      scope.update = function (source) {
	      	var duration = d3.event && d3.event.altKey ? 5000 : 500;

	      	//compute the new tree layout
        	var nodes = tree.nodes(root).reverse();

        	//normalize for fixed-depth
        	nodes.forEach(function(d) { d.y = d.depth * 225; });

        	//declare the nodes
        	var node = vis.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

          //enter any new nodes at the parent previous position
        	var nodeEnter = node.enter().append('svg:g')
          .attr('class', 'node')
          .attr('transform', function(d) {
            return 'translate(' + source.y0 + ',' + source.x0 + ')'; })
          .on('click', function(d) { toggle(d); update(d); });

          nodeEnter.append('svg:circle')
          .attr('r', 1e-6)
          .style('fill', function(d) { return d._children ? '#8f8f8f' : '#fff'; })  
          .style('stroke', '#8f8f8f');        

        	nodeEnter.append('svg:text')
          .each(function(d) {
            var lines = d.name.split('\n');
            for (var i=0; i < lines.length; i++){             
              d3.select(this)
                .append('tspan')
               .attr('dy', function(d) { 
                  if (d.depth == 0){
                    return '0.35em';
                  }else{
                    return (i==0) ? '0.26em' : '1.1em'; 
                  }
                })
                .attr('x', function(d) {                  
                    return d.children || d._children ? -13 : 60;                   
                })
                .text(lines[i]);                               
            }
          })
          .attr('text-anchor', function(d) { return d.children || d._children ? 'end' : 'start'; })          
          .style('fill', function(d) {
            return d.value ? d.value : '#8f8f8f';
          })

          nodeEnter.append("svg:text")  
	        .attr('class', 'icon')
	        .attr('x', function(d) {
	          return d.children || d._children ? -13 : 20; 
	        })
	        .attr('text-anchor', 'middle')
	        .attr('dominant-baseline', 'central')
	        .style('fill', function(d) {
	            return d.value ? d.value : '#8f8f8f';
	          })        
	        .style('font-size', '1.3em')
	        .text(function(d) { 
	          return d.children || d._children ? '' : d.icon ; 
	        })

	        nodeEnter.append("svg:text")  
	        .attr('class', 'wish')
	        .attr('x', function(d) {
	          return d.children || d._children ? -13 : 43; 
	        })
	        .attr('text-anchor', 'middle')
	        .attr('dominant-baseline', 'central')
	        .style('fill', function(d) {
	          return d.value ? d.value : '#8f8f8f';
	        })
	        .style('font', 'normal 15px sans-serif')
	        .text(function(d) { return d.children || d._children ? '' : d.wish})

					// Transition nodes to their new position.
        	var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        	nodeUpdate.select("circle")
          .attr("r", 4.5)
          .style("fill", function(d) { return d._children ? "#8f8f8f" : "#fff"; })       

        	nodeUpdate.select("text")
          .style("fill-opacity", 1);

          // Transition exiting nodes to the parent's new position.
        	var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

        	nodeExit.select("circle")
          .attr("r", 1e-6);

        	nodeExit.select("text")
          .style("fill-opacity", 1e-6);

          // Update the links…
        	var link = vis.selectAll("path.link")
          .data(tree.links(nodes), function(d) { return d.target.id; });

        	// Enter any new links at the parent's previous position.
        	link.enter().insert("svg:path", "g")
          .attr("class", "link")                   
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
            })
          .transition()
          .duration(duration)
          .attr("d", diagonal);

        	// Transition links to their new position.
        	link.transition()
          .duration(duration)
          .attr("d", diagonal);

        	// Transition exiting nodes to the parent's new position.
        	link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
          .remove();

        	// Stash the old positions for transition.
        	nodes.forEach(function(d) {
          	d.x0 = d.x;
          	d.y0 = d.y;
        	});

		    }
		    //scope.update(scope.data);
	      scope.$watch('data', function() {
	      	scope.update(scope.data);
	      });

			}
		}
	})
});