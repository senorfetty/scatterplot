let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req= new XMLHttpRequest()

let values= []

let yScale 
let xScale
let xAxisScale
let yAxisScale


let height=600
let width=700
let padding=50  

let svg = d3.select('svg')


req.open('GET', url, true);
req.onload = () =>  {
    values = JSON.parse(req.responseText);
    console.log(values)
    drawCanvas();
    generateScale();
    drawScatter();
    generateAxis();
};
req.send();


drawCanvas = () =>  {
    svg.attr('width',width)
    svg.attr('height', height)
    svg.append('div')
    svg.attr('id','legend')

}

drawScatter = () => {

    let tooltip = d3.select('body')
    .append('div')
    .attr('id','tooltip')
    .style('visibility', 'hidden')
    .style('width','auto')
    .style('height','auto')

    svg.selectAll('circle')
    .data(values)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r',7)
    .attr('data-xvalue', (d) => d['Year'] )
    .attr('data-yvalue', (d) => new Date(d['Seconds'] * 1000))
    .attr('cx', (d) => xScale(d['Year']))
    .attr('cy', (d) => yScale(new Date(d['Seconds'] * 1000)))
    .attr('fill', (d) =>  {if(d['Doping']) {
        return 'black';
    } else { return 'white';
    }})

    .on('mouseover' , (d) => {
        tooltip.transition().style("visibility", "visible")  
        if(d['Doping']){ 
            tooltip.text(d["Name"]+ " , "+ d["Year"]+ " , " + d["Time"] + " , "+ d["Doping"]) 
        }else{ 
            tooltip.text(d["Name"]+ " , "+ d["Year"]+ " , " + d["Time"] + " , "+ d["Doping"]) 
        }
        
        tooltip.attr('data-year', d['Year'])
    })
    .on('mouseout',(d) => {
        tooltip.transition().style('visibility','hidden')
    })

}

generateScale = () =>  {

    xScale = d3.scaleLinear()
    .domain([d3.min(values, (d) => d['Year'] -1),d3.max(values, (d) => d['Year']+1)])
    .range([padding, width-padding])

    yScale = d3.scaleTime()
    .domain([d3.min(values, (d) => new Date(d['Seconds']*1000)),d3.max(values, (d) => new Date(d['Seconds']*1000))])
    .range([padding, height-padding])

    // xAxisScale = d3.scaleLinear()
    // .domain([0,d3.max(data, (d) => d)])
    // .range([padding, width-padding])

    // yAxisScale = d3.scaleLinear()
    // .range([height-padding, padding])

}

generateAxis = () => {

    xAxis= d3.axisBottom(xScale)
    .tickFormat(d3.format("d"))

    yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat("%M:%S"))

    svg.append('g')
    .call(xAxis)
    .attr('id','x-axis')
    .attr('transform' , 'translate(0,' + (height-padding)  + ')')

    svg.append('g')
    .call(yAxis)
    .attr('id','y-axis')
    .attr("transform", "translate("+ padding + ", 0)") 
}