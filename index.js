var pop;

// Setting Dimensions of the canvas
const margin = {top: 10, right: 20, bottom: 50, left: 50};
const width = 800 - margin.left - margin.right;
const height = 470 - margin.top - margin.bottom;


// Creating the Canvas
var g = d3.select("#chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");


// data
 document.addEventListener('DOMContentLoaded', function() {
    
    Promise.all([d3.csv('data/population_total.csv'),
                d3.csv('data/life_expectancy_years.csv'),
                d3.csv('data/child_mortality_0_5_year_olds_dying_per_1000_born.csv'),
                d3.csv('data/countries_regions.csv'),
                d3.csv('data/children_per_woman_total_fertility.csv')])
    .then(function(values){
    
        pop_data = values[0];
        life_exp_data = values[1];
        child_mortality = values[2];
        countries_region = values[3];
        fertilitydata = values[4];
    
        drawGapMinder();
    })
});


function drawGapMinder()
{   
    g.selectAll("*").remove();
    processing();
    function processing()
        {
            var year=document.getElementById('year').value;
            var xaxis=document.getElementById('x').value;
            var yaxis=document.getElementById('y').value;
            var region=document.getElementById('region').value;

            var xData;

                if(xaxis=="fertility")
                    xData=fertilitydata;
                if(xaxis=="child_mortality")
                    xData=child_mortality;
                if(xaxis=="life_exp")
                    xData=life_exp_data;
                if(xaxis=="population")
                    xData=pop_data;

            var yData;

                if(yaxis=="fertility")
                    yData=fertilitydata;
                if(yaxis=="child_mortality")
                    yData=child_mortality;
                if(yaxis=="life_exp")
                    yData=life_exp_data;
                if(yaxis=="population")
                    yData=pop_data;

            var filteredRegionData=countries_region.filter(data =>  data['World bank region']==region || region=='all');
            dataset=[];

            console.log(dataset);


            filteredRegionData.map(function(rd){
                country=rd['name'];
                var filteredX=xData.filter(data=> data['country']==rd['name']);
                var filteredY=yData.filter(data=> data['country']==rd['name']);

                if(filteredX.length >0 && filteredY.length>0 && filteredX[0][year]!='' && filteredX[0][year]!='')

                    dataset.push({
                        "x":Number(filteredX[0][year]),
                        "y":Number(filteredY[0][year]),
                        "region":rd['World bank region'],
                        "abbr":rd['geo']});
                    })
    
        //Calculating the min and max of xData and yData for Scales           
        let x_min=d3.min(dataset, function(d) { return d.x; })
        let x_max=d3.max(dataset, function(d) { return d.x; });
        let y_min=d3.min(dataset, function(d) { return d.y; });
        let y_max=d3.max(dataset, function(d) { return d.y; });
        
        //Scaling the X and Y axis 
        let yScale = d3.scaleLinear()
            .domain([0, y_max])
            .range([height - margin.bottom, margin.top]);
        let xScale = d3.scaleLinear()
            .domain([0, x_max])
            .range([margin.left, width - margin.right]);
        
        //Y Axis label
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",margin.left-60)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("font-family", "sans-serif")
            .style("font-size", "17px")
            .style("font-weight",500)
            .style("text-anchor", "middle")
            .style("fill","grey")
            .text("Y axis");  
        
        //X Axis label
        g.append("text")             
            .attr("transform",
                    "translate(" + (width/2) + " ," + (height -margin.top) + ")")
            .style("text-anchor", "middle")
            .style("font-family", "sans-serif")
            .style("font-size", "17px")
            .style("font-weight",500)
            .style("fill","grey")
            .text("X Axis");
        
        //X Axis
        const xAxis = d3.axisBottom(xScale).ticks(5);
            g.append("g")
                  .attr("transform", `translate(0,${height - margin.bottom})`)
                  .style("font-family", "sans-serif")
                  .call(xAxis)
                  .style("stroke","grey")
                  .attr("class","xAxis");  
        
        //Y Axis
        const yAxis = d3.axisRight(yScale).ticks(5);
            g.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .style("font-family", "sans-serif")
                .call(yAxis)
                .style("stroke","grey")
                .attr("x", -30)
                .call(g => g.select(".domain"))
                .attr("class","yAxis"); 
        
        g.selectAll("dot")
            .data(dataset)
            .enter().append("circle")
            .attr("r", 4)
            .attr("cx", function(d) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .style("opacity", 0.8);
    
        }
    

    }
