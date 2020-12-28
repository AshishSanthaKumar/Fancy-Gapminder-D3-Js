var pop;
var x_max;
var y_max;
var time =0;
var yScale;
var xScale;
var gdots;
var yData;
var xData;
var g;
var xLabel;
var yLabel;
var button;
var timeLabel;
var time;
var legend;
var keys = ["South Asia", "Europe & Central Asia", "Middle East & North Africa", "Sub-Saharan Africa","Latin America & Caribbean", "East Asia & Pacific", "North America"];



// Setting Dimensions of the canvas
const margin = {top: 20, right: 30, bottom: 80, left: 80};
const width = 1000 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;



var color = d3.scaleOrdinal(d3.schemeSet3);


// data
document.addEventListener('DOMContentLoaded', function() {
    
    Promise.all([d3.csv('https://raw.githubusercontent.com/AshishSanthaKumar/Fancy-Gapminder-D3-Js/master/data/population_total.csv'),
                d3.csv('https://raw.githubusercontent.com/AshishSanthaKumar/Fancy-Gapminder-D3-Js/master/data/life_expectancy_years.csv'),
                d3.csv('https://raw.githubusercontent.com/AshishSanthaKumar/Fancy-Gapminder-D3-Js/master/data/child_mortality_0_5_year_olds_dying_per_1000_born.csv'),
                d3.csv('https://raw.githubusercontent.com/AshishSanthaKumar/Fancy-Gapminder-D3-Js/master/data/countries_regions.csv'),
                d3.csv('https://raw.githubusercontent.com/AshishSanthaKumar/Fancy-Gapminder-D3-Js/master/data/children_per_woman_total_fertility.csv'),
                d3.csv('https://raw.githubusercontent.com/AshishSanthaKumar/Fancy-Gapminder-D3-Js/master/data/income_per_person_gdppercapita.csv')])
    .then(function(values){
    
        pop_data = values[0];
        life_exp_data = values[1];
        child_mortality = values[2];
        countries_region = values[3];
        fertilitydata = values[4];
        incomeData = values[5];
    
        drawGapMinder();
    })
});


function drawGapMinder()
{

 // Creating the Canvas
g = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");

legend = d3.select("#legend").append("svg")
    .attr("width", 180)
    .attr("height", 380)
    .attr("id","keySvg")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  update();    

}

//Updating data for each change after the first render
function update(){

    preprocess();

    //Legend 

    legend.append("text")             
        .attr("transform",
              "translate(" + (-margin.left+55) + " ," + (margin.top+100) + ")")
        .style("text-align", "center")
        .style("font-family", "sans-serif")
        .style("font-size", "15px")
        .style("fill","black")
        .style("opacity",0.8)
        .style("font-weight",700)
        .attr("text-decoration","underline")
        .text("Legend");

    legend.selectAll("keyLegend")
        .data(keys)
        .enter()
        .append("rect")
          .attr("width", 11)
          .attr("height", 11)
          .attr("x", -70)
          .attr("y", function(d,i){ return margin.top+120+ i*25})
          .style("fill", function(d){return color(d)})
          .style("stroke-width",2)
          .style("stroke","black")
          .style("alignment-baseline", "middle");

        legend.selectAll("keyLabel")
          .data(keys)
          .enter()
          .append("text")
            .attr("x",-50)
            .attr("y", function(d,i){ return margin.top+130+ i*25}) 
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("font-family", "sans-serif")
            .style("font-size", "11px");

    //Setting the transition time as 1 second

    var t = d3.transition()
    .duration(1000);

    //The Year label at the bottom right

    labeltext = Number(document.getElementById("year").value);


    timeLabel = g.append("text")
    .attr("y", height -100)
    .attr("x", width - 70)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .attr("class","labeltext")
    .text(labeltext);

    //Too

    var tooltipDiv = d3.select("body")
    .append("div")
    .attr("class", "mapTooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("color","black")
    .style("visibility", "hidden");

    g.selectAll('g.points')
        .data(dataset, function(d){return d.abbr;})
        .join(
          enter => enterCircle(enter, t,tooltipDiv),
          update => updateCircle(update, t,tooltipDiv),
          exit => exitCircle(exit, t,tooltipDiv)
        )
    
    function enterCircle(enter, t,tooltipDiv) {

    enter.append('g')
    .attr("class","points")
    .call(g => 
        g.append("circle")
        .attr("fill", function(d) { return color(d.region); })
        .style("stroke", "black")
        .on('mouseover', function(d,i) {
            tooltipDiv.html("Country: "+d.country)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px")
            .style("visibility", "visible")
            .attr("data-html", "true");
        })
        .on('mousemove',function(d,i) {
            tooltipDiv.html("Country: "+d.country)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px")
            .style("visibility", "visible")
            .attr("data-html", "true");
        })
        .on('mouseout', function(d,i) {
            tooltipDiv.style("visibility", "hidden");
        })
        .style("opacity", 0.0)
        .attr("cy", function(d){ return yScale(d.y); })
        .attr("cx", function(d){ return xScale(d.x); })
        .transition(t)
            .style("opacity", 1.0)
            .attr("cy", function(d){ return yScale(d.y); })
            .attr("cx", function(d){ return xScale(d.x); })
            .attr("r", 12)

    )
    .call(g => 
        g.append("text")
        .style("fill","black")
        .style("font-weight","bold")
        .style("font-size", "8px")
        .on('mouseover', function(d,i) {
            tooltipDiv.html("Country: "+d.country)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px")
            .style("visibility", "visible")
            .attr("data-html", "true");
        })
        .on('mousemove',function(d,i) {
            tooltipDiv.html("Country: "+d.country)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px")
            .style("visibility", "visible")
            .attr("data-html", "true");
        })
        .on('mouseout', function(d,i) {
            tooltipDiv.style("visibility", "hidden");
        })
        .style("opacity", 0.0)
        .attr("y", function(d){ return yScale(d.y)+2; })
        .attr("x", function(d){ return xScale(d.x)-8; })
        .transition(t)
            .style("opacity", 1.0)
            .attr("y", function(d){ return yScale(d.y)+2; })
            .attr("x", function(d){ return xScale(d.x)-8; })
            .text(function(d){
                return d.abbr.toUpperCase();})

    )
    }

    function updateCircle(update, t,tooltipDiv) {

    update
    .call(g => g.select('text')
            .transition(t)
            .style("opacity", 1.0)
            .attr("y", function(d){ return yScale(d.y)+2; })
            .attr("x", function(d){ return xScale(d.x)-8; })
            .text(function(d){
                return d.abbr.toUpperCase();})
    )
    .call(g => g.select('circle')
        .transition(t)
        .style("opacity", 1.0)
        .attr("cy", function(d){ return yScale(d.y); })
        .attr("cx", function(d){ return xScale(d.x); })
        .attr("r", 12)

    )
    }

    function exitCircle(exit, t,tooltipDiv) {

    exit
    .call(g =>
        g.transition(t)
            .style('opacity', 0)
        .remove()
    )
    }


}

function preprocess(){
            g.selectAll(".xAxis").remove();
            g.selectAll(".yAxis").remove();
            g.selectAll(".yLabel").remove();
            g.selectAll(".xLabel").remove();
            g.selectAll(".labeltext").remove();

            var year=document.getElementById('year').value;
            var xaxis=document.getElementById('x').value;
            var yaxis=document.getElementById('y').value;
            var region=document.getElementById('region').value;
            
            x_max = null;
            y_max = null;
            

                if(xaxis=="fertility")
                    xData=fertilitydata;
                if(xaxis=="child_mortality")
                    xData=child_mortality;
                if(xaxis=="life_exp")
                    xData=life_exp_data;
                if(xaxis=="population")
                    xData=pop_data;
                if(xaxis=="income")
                    xData=incomeData;

            

                if(yaxis=="fertility")
                    yData=fertilitydata;
                if(yaxis=="child_mortality")
                    yData=child_mortality;
                if(yaxis=="life_exp")
                    yData=life_exp_data;
                if(yaxis=="population")
                    yData=pop_data;
                if(yaxis=="income")
                    yData=incomeData;

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
            
                    if( !isNaN(filteredX[0][year]) &&  !isNaN(filteredY[0][year]) && filteredX[0][year].trim()!='' && filteredY[0][year].trim()!='')

                        dataset.push({
                            "x":Number(filteredX[0][year]),
                            "y":Number(filteredY[0][year]),
                            "region":rd['World bank region'],
                            "abbr":rd['geo'],
                            "country":rd['name']}); 
                    }
    
            
            })

            scaling();
}

 //Scaling the X and Y axis 
function scaling(){
   
    yScale = d3.scaleLinear()
        .domain([0, y_max])
        .range([height - margin.bottom, margin.top]);
    xScale = d3.scaleLinear()
        .domain([0, x_max])
        .range([margin.left, width - margin.right]);

    if (xData==fertilitydata)
        xLabel="Total Fertility rate (No of Children)";
    if (xData==child_mortality)
        xLabel="Child Mortality (Deaths per 1000 born)";
    if (xData==life_exp_data)
        xLabel="Life Expectancy (in Years)";
    if (xData==pop_data)
        xLabel="Total Population";
    if (xData==incomeData)
        xLabel="Income Per Person";     
        
    if (yData==fertilitydata)
        yLabel="Total Fertility rate (No of Children)";
    if (yData==child_mortality)
        yLabel="Child Mortality (Deaths per 1000 born)";
    if (yData==life_exp_data)
        yLabel="Life Expectancy (in Years)";
    if (yData==pop_data)
        yLabel="Total Population";
    if (yData==incomeData)
        yLabel="Income Per Person";  

    //Y Axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y",margin.left-100)
        .attr("x",0 - (height / 2-30))
        .attr("dy", "1em")
        .style("font-family", "sans-serif")
        .style("font-size", "18px")
        .style("font-weight",600)
        .style("text-anchor", "middle")
        .style("fill","black")
        .attr("class","yLabel")
        .text(yLabel);  

    //X Axis label
    g.append("text")             
        .attr("transform",
                "translate(" + (width/2+50) + " ," + (height -margin.top) + ")")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "18px")
        .style("font-weight",600)
        .style("fill","black")
        .attr("class","xLabel")
        .text(xLabel);

    //X Axis
    const xAxis = d3.axisBottom(xScale).ticks(11);
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

//Play Pause Functionality
function updateTimer()
    {
        
        button=document.getElementById("play").value;
        if (button == "Pause") {
            clearInterval(timer);
            document.getElementById("play").value="Play";
            } else {
            timer = setInterval(step, 1000);
            document.getElementById("play").value="Pause";
            }
    }

function step() {
        var years=Number(document.getElementById("year").value);
        if(years==2020)
        {
            clearInterval(timer);
            document.getElementById("play").value="Play";
        }
        else{
        years=years+1;
        document.getElementById("year").value=years;
        update();
        }
    }