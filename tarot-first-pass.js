//randomization station
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

//bring in our data
const data = d3.csv("/data/tarotImages.csv").then((data) => {

console.log(data);

//Subsetting the deck for later   
const majors = data.slice(0,22);    
const cups = data.slice(22,36);
const swords = data.slice(36,50);
const wands = data.slice(50,64);
const coins = data.slice(64,78);

//select the body
const body = d3.select("main");

const svg = body.append("svg")
                .attr("height","430")
                .attr("width","740")
                .style("border","1px solid #D62828")
                .style("background-color","#ffffff")
                .attr("class","center-up");
    
const readYourCards = () => {
    //shuffling the deck, pulling the specified number of cards
let countCards = document.getElementById("countCards");
let spreadSize = countCards.options[countCards.selectedIndex].value;
//console.log(spreadSize);
let yourReading = d3.shuffle(data).slice(0,spreadSize);
    //variables for the timing on the card transitions bc I can't make up my mind
let cardDelay = 1200 ;
let textDelay = 1300 ;
 
let xScale = d3.scaleBand()
                .domain(yourReading.map(d=>d.name))
                .range([0,740])
                .paddingInner(0.1)
                .paddingOuter(0.2);
    
let cardsTooBig = (d) => {
    if (spreadSize < 3){
        return 200;
    } else {
        return xScale.bandwidth();
    }
};

let staggerNames = (n) => {
    if (spreadSize < 4){
        return 405;
    } else if (spreadSize == 4) {
        return 355;
    } else {
        return 280 + 25*n;
    }
};
    
let staggerCards = (n) => {
    if (spreadSize == 5){
        return 30 + ((n-1)*25);
    } else if (spreadSize == 6){
        return 40 + n*25;
    } else {
        return 30;
    }
};

let drawnCards = svg.selectAll("image")
                    .data(yourReading)
                    .join("image")
                    .attr("xlink:href", (d) => "/data/cards/" + d.img)
                    .attr("width",(d) => cardsTooBig(d))
                    .attr("x", (d) => xScale(d.name))
                    .attr("y", -550);
drawnCards
                    .transition().duration((d,i) => cardDelay + i*cardDelay)
                    .attr("y", (d,i) => staggerCards(i));
drawnCards
                    .data(yourReading)
                    .on("click",function(){
                        let thisCard = d3.select(this);
                        let interestCard = thisCard.data()[0];
                        let interestNum = interestCard.number;
                        let arcanaCheck = interestCard.arcana;
                getDeets([interestCard]);
                drawNumerol(interestNum,arcanaCheck,[interestCard]);
                    });
    
let cardNames = svg.selectAll(".card-title")
                    .data(yourReading)
                    .join("text")
                    .text(d => d.name)
                    .attr("class","card-title")
                     .attr("text-anchor","middle")
                    .attr("y", (d,i) => staggerNames(i))
                    .attr("x", (d) => (0.5*cardsTooBig(d)) + xScale(d.name))
                    .style("opacity",0)
                    .transition().duration((d,i) => textDelay + i*textDelay)
                    .style("opacity",1);
    

                    
    

}

//Make the button run the thing

const ReadingButton = document.querySelector("#getReading");
ReadingButton.addEventListener("click", () => readYourCards());
    
//split up cards by their number
    
body.append("p")
            .text("Click on any of the cards you drew to generate insights below.")
            .attr("class","center-up")
            .attr("class","p")
            .style("margin","20px 0px 0px 0px");

body.append("h2")
        .attr("class","sectHead")
        .text("Keywords");

const svg1 = body.append("svg")
                    .attr("height","300")
                    .attr("width","500")
                    .style("border","1px solid #D62828")
                    .style("background-color","#ffffff")
                    .attr("class","center-up");
    
//a function that drops the comma if there's only 3 descriptors
const onlyThrees = (keyword3,keyword4) => {
    if (keyword4 == "") {
        return keyword3;
    } else {
        return keyword3 + ', ' + keyword4 ;
    }
};
   
    
let getDeets = (intCard) => {
    svg1.selectAll("image")
                    .data(intCard)
                    .join("image")
                    .attr("xlink:href", (d) => "/data/cards/" + d.img)
                    .attr("width",150)
                    .attr("x", 20)
                    .attr("y", 20)
                    .attr("opacity",0)
                    .transition().duration(400)
                    .attr("opacity",1);
    
    svg1.selectAll(".card-title-d")
            .data(intCard)
            .join("text")
            .text(d => d.name)
            .attr("class","card-title-d")
            .attr("text-anchor","middle")
            .attr("y",45)
            .attr("x",330)
            .style("opacity",0)
            .transition().duration(400)
            .style("opacity",1);
    
    svg1.selectAll(".cardSub1")
            .data(intCard)
            .join("text")
            .text(d => d.keywords__001)
            .attr("class","cardSub1")
            .attr("x",220)
            .attr("y",90);
    
    svg1.selectAll(".cardSub2")
            .data(intCard)
            .join("text")
            .text(d => d.keywords__002)
            .attr("class","cardSub2")
            .attr("x",220)
            .attr("y",140);
    
    svg1.selectAll(".cardSub3")
            .data(intCard)
            .join("text")
            .text(d => d.keywords__003)
            .attr("class","cardSub3")
            .attr("x",220)
            .attr("y",190);
    
    svg1.selectAll(".cardSub4")
            .data(intCard)
            .join("text")
            .text(d => d.keywords__004)
            .attr("class","cardSub4")
            .attr("x",220)
            .attr("y",230);
    
    
}
    
body.append("h2")
        .attr("class","sectHead")
        .text("Numerology");
    
body.append("p")
        .text("The number on a card can tell you a lot! The major arcana in the center governs the minor arcana cards around it, and they're all connected by the notes at the top of the section. (Major Arcana that don't govern minor cards will appear alone.)")

const svg2 = body.append("svg")
                .attr("height","480")
                .attr("width","500")
                .style("border","1px solid #D62828")
                .style("background-color","#ffffff")
                .attr("class","center-up");
    
    
//###############################//
//DOING ALL THE NUMEROLOGY STUFF//
//###############################//
let countEm = {};
    
for (i = 0; i < 11; i++) {
    countEm[i] = data.slice(i,i+1)
                    .concat(data.slice(i+21,i+22))
                    .concat(data.slice(i+35,i+36))
                    .concat(data.slice(i+49,i+50))
                    .concat(data.slice(i+63,i+64));
};


const numerLocY = (n) => {
    if (n == 0) {
        return 325;
    } else if (n > 2){
        return 380;
    } else {
        return 150;
    }
};

const numerLocX = (n) => {
    if (n == 0) {
        return 250;
    } else if ((n % 2) == 0) {
        return 425;
    } else {
        return 75;
    }
};
    
const numerCardH = (n) => {
    if (n == 0) {
        return 250;
    } else {
        return 180;
    }
};
    
const numerCardW = (n) => {
    if (n == 0) {
        return 175;
    } else {
        return 90;
    }
};
    
const CenCardY = (n) => {
    if (n == 0) {
        return 90;
    } else {
        return 0;
    }
};
    
const CenCardX = (n) => {
    if (n == 0) {
        return 35;
    } else {
        return 0;
    }
};
    

const drawNumerol = (n,arc,rd) => {
    if (n > 0 && n < 11) {
        svg2.selectAll("*").remove();
        
        svg2.selectAll(".card-title-n")
            .data(countEm[n])
            .join("text")
            .attr("class","card-title-n")
            .text(d => d.name)
            .attr("text-anchor","middle")
            .attr("y", (d,i) => numerLocY(i)+80)
            .attr("x", (d,i) => numerLocX(i));

        svg2.selectAll(".numer-descrip")
            .data(countEm[n])
            .join("text")
            .attr("class","numer-descrip")
            .text(countEm[n][1].Numerology)
            .attr("text-anchor","middle")
            .attr("x", (d,i) => 250 + i*1000)
            .attr("y", 25);

        svg2.selectAll("image")
            .data(countEm[n])
            .join("image")
            .attr("xlink:href", (d) => "/data/cards/" + d.img)
            .attr("y", (d,i) => numerLocY(i)-102-CenCardY(i))
            .attr("x", (d,i) => numerLocX(i)-45-CenCardX(i))
            .attr("height",(d,i) => numerCardH(i))
            .attr("width", (d,i) => numerCardW(i));
    } else if ((arc == "Major Arcana") && n >= 11 || n == 0){
        svg2.selectAll("*").remove();
        
        svg2.selectAll("image")
            .data(rd)
            .join("image")
            .attr("xlink:href", (d) => "/data/cards/" + d.img)
            .attr("y", 60)
            .attr("x", 135)
            .attr("width", 230);
        
        svg2.selectAll(".numer-descrip")
            .data(rd)
            .join("text")
            .attr("class","numer-descrip")
            .text(rd[0].Numerology)
            .attr("text-anchor","middle")
            .attr("x", (d,i) => 250 + i*1000)
            .attr("y", 25);
        
        svg2.selectAll(".card-title-n").remove();
        
    } else{
        svg2.selectAll("*").remove();
        
        svg2.append("text")
                .text("Oops!")
                .attr("class","court-error")
                .attr("y",50)
                .attr("x",20);
        
        svg2.append("text")
                .text("The court cards don't have numerological data yet, my bad.")
                .attr("y",75)
                .attr("x",20);
        
        svg2.append("text")
                .text("Try a different card.")
                .attr("y",100)
                .attr("x",20);
    }
}

body.append("p")
        .text("That's all (for now)! Click a different card or draw a new spread to learn more.")
        .attr("class","lastWord");
//END OF DATA, TURN BACK
}
);