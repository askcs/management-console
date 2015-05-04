define(['controllers/controllers'], function (controllers){
	'use strict';

	controllers.controller('domains', ['$scope', '$rootScope', '$location', 'Session', 'Store', 'Monitors',
		function($scope, $rootScope, $location, Session, Store, Monitors){			

			var monitors = Store('domain').get('monitors');
     	var lmonitor = [];
     	var domain = Store('environment').get('domain');

     	function getColor (isRunning){
        switch (isRunning){
            case 'OFF' : return '#8f8f8f';
            break;

            case 'UNKNOWN': return '#C2771B';
            break;

            case 'MONITOR' : return '#397D39';
            break;

            case 'ESCALATE' : return '#D34545';
            break;

            default: 
              return '#8f8f8f';
          }
      }

      function getIcon(mobileMedium) {
        switch (mobileMedium) {
          case 'PHONE': return '\uf095';
          break;

          case 'APP': return '\uf075';
          break;

          case 'EMAIL': return '\uf01c';
          break;

          case 'SMS': return '\uf0e0'; 
        }
      }

      angular.forEach(monitors.data, function(monitor) {
      if (monitor.length > 1) {        
        angular.forEach(monitor, function (ch) {
           ch.isRunning = 'ESCALATE';
           ch.mobileMedium = 'EMAIL';
          var color = getColor(ch.isRunning);        
          var icon = getIcon(ch.mobileMedium);

          lmonitor.push({
            name: ch.name + '\n' + ch.groupName,
            wish: ch.wish,
            value: color,
            icon: icon
          });
        })
      }else{       
        var color = getColor(monitor[0].isRunning);
        var icon = getIcon(monitor[0].mobileMedium);

        lmonitor.push({
          name: monitor[0].name + '\n' +  monitor[0].groupName,
          wish: monitor[0].wish,
          value: color,     
          icon: icon
        });
      }
    });

    //define content for the tree
    var content = {
      name : domain.toUpperCase(),
      children: lmonitor
    }

      var m = [20, 20, 20, 120],
        w = 1100 - m[1] - m[3],
        h = 980 - m[0] - m[2],
        i =0,
        root;

      var tree = d3.layout.tree()
          .separation(function(a, b) { return a.parent == b.parent ? 1 : 2 })
          .size([h,w]);

      var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });

      var vis = d3.select('#tree').append('svg:svg')
        .attr('width', w + m[1] + m[3])
        .attr('height', h + m[0] + m[2])
        .append('svg:g')
        .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

      root = content;
      root.x0 = h/2;
      root.y0 = 0;

      function toggleAll(d) {
        if (d.children) {
          d.children.forEach(toggleAll);
          toggle(d);
        }
      }

      update(root);

      function update(source) {
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
			
		}
	]);
});