var pop;
var x_max;
var y_max;
var time =0;
var yScale;
var xScale;

// Setting Dimensions of the canvas
const margin = {top: 20, right: 30, bottom: 80, left: 80};
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Creating the Canvas
var g = d3.select("#chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");

var color = d3.scaleOrdinal(d3.schemeTableau10);


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
    
    console.log(x_max);
    console.log(y_max);
        
         //Scaling the X and Y axis 
     yScale = d3.scaleLinear()
            .domain([0, y_max])
            .range([height - margin.bottom, margin.top]);
     xScale = d3.scaleLinear()
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
        const xAxis = d3.axisBottom(xScale).ticks(10);
            g.append("g")
                  .attr("transform", `translate(0,${height - margin.bottom})`)
                  .style("font-family", "sans-serif")
                  .call(xAxis)
                  .style("stroke","grey")
                  .attr("class","xAxis");  

        //Y Axis
        const yAxis = d3.axisLeft(yScale).ticks(10);
            g.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .style("font-family", "sans-serif")
                .call(yAxis)
                .style("stroke","grey")
                .attr("x", -30)
                .call(g => g.select(".domain"))
                .attr("class","yAxis"); 
        
        //Scatter plot
        g.selectAll("dot")
            .data(dataset)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 12)
            .attr("cx", function(d) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .style("opacity", 1)
            .style("fill", function(d) { return color(d.region); });
            
    
    
    }


    function processing()
        {
            g.selectAll(".xAxis").remove();
            g.selectAll(".yAxis").remove();

            var year=document.getElementById('year').value;
            var xaxis=document.getElementById('x').value;
            var yaxis=document.getElementById('y').value;
            var region=document.getElementById('region').value;
            
            x_max = null;
            y_max = null;
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

            filteredRegionData.map(function(rd){
                country=rd['name'];
                var filteredX=xData.filter(data=> data['country']==rd['name']);
                var filteredY=yData.filter(data=> data['country']==rd['name']);
                
                if(filteredX.length >0 && filteredY.length>0)
                {
                    for (var key in filteredX[0]) {
                        if (filteredX[0].hasOwnProperty(key)) {
                        if(key!='country' && (x_max==null || Number(filteredX[0][key])>=x_max) )
                        x_max=Number(filteredX[0][key]);
                        }
                    }

                    for (var key in filteredY[0]) {
                        if (filteredY[0].hasOwnProperty(key)) {
                        if(key!='country' && (y_max==null || Number(filteredY[0][key])>=y_max) )
                        y_max=Number(filteredY[0][key]);
                        }
                    }
            
                    if(filteredX[0][year]!='' && filteredX[0][year]!=''  && !isNaN(filteredX[0][year]) &&  !isNaN(filteredY[0][year]))

                        dataset.push({
                            "x":Number(filteredX[0][year]),
                            "y":Number(filteredY[0][year]),
                            "region":rd['World bank region'],
                            "abbr":rd['geo'],
                            "country":rd['name']}); 
                    }
    
            
            })


                //Scaling the X and Y axis 
                yScale = d3.scaleLinear()
                    .domain([0, y_max])
                    .range([height - margin.bottom, margin.top]);
                xScale = d3.scaleLinear()
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
                const xAxis = d3.axisBottom(xScale).ticks(10);
                    g.append("g")
                        .attr("transform", `translate(0,${height - margin.bottom})`)
                        .style("font-family", "sans-serif")
                        .call(xAxis)
                        .style("stroke","grey")
                        .attr("class","xAxis");  

                //Y Axis
                const yAxis = d3.axisLeft(yScale).ticks(10);
                    g.append("g")
                        .attr("transform", `translate(${margin.left},0)`)
                        .style("font-family", "sans-serif")
                        .call(yAxis)
                        .style("stroke","grey")
                        .attr("x", -30)
                        .call(g => g.select(".domain"))
                        .attr("class","yAxis");

                

        }


        function update(){

            processing();

            var t = d3.transition()
                .duration(1000);

            var circles = g.selectAll("circle").data(dataset, function(d){
                return d.country;
            });
        

            circles.exit()
                .transition(t)
                    .style("opacity",0)
                .remove();

            circles.enter()
                .append("circle")
                .attr("class", "enter")
                .attr("class", "dot")
                .style("fill", function(d) { return color(d.region); })
                .style("opacity",0)
                .attr("cy", function(d){ return yScale(d.y); })
                .attr("cx", function(d){ return xScale(d.x) })
                .attr("r", 12)
                .merge(circles)
                .transition(t)
                    .style("opacity",1)
                    .attr("cy", function(d){ return yScale(d.y); })
                    .attr("cx", function(d){ return xScale(d.x) })
                    .attr("r", 12);
        }