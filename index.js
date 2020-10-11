// Setting Dimensions of the canvas
const margin = {top: 10, right: 20, bottom: 50, left: 50};
const width = 800 - margin.left - margin.right;
const height = 470 - margin.top - margin.bottom;

// data
 document.addEventListener('DOMContentLoaded', function() {
    Promise.all([d3.csv('data/population_total.csv'),
                d3.csv('data/life_expectancy_years.csv'),
                d3.csv('data/income_per_person_gdppercapita.csv'),
                d3.csv('data/countries_regions.csv'),
                d3.csv('data/children_per_woman_total_fertility.csv')])
    .then(function(values){
    
    population = values[0];
    life_exp = values[1];
    gdp_per_capita = values[2];
    countries_region = values[3];
    fertility = values[4];
    console.log(population);
    console.log(life_exp);
    console.log(gdp_per_capita);
    console.log(countries_region);
    console.log(fertility);
    })
    });


// Creating the Canvas
var g = d3.select("#chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");



