const fs = require('fs');
const scrapeIt = require("scrape-it");
const dataFolder = './data';
const json2csv = require('json2csv');
let shirtLinks = [];
let shirtInfo = [];
let dateFormat = new Date();
dateFormat = dateFormat.toISOString().slice(0,10);
const urlMain = "http://shirts4mike.com/";
const entry = "http://shirts4mike.com/shirts.php";
const fields = ['Title', 'Price', 'ImageUrl', 'URL', 'Time'];


scrapeIt(`${entry}`,{
  shirts:{
  listItem: '.products li',
  data:{
    links:{
      selector:"a"
      ,attr: "href"
      }
    }
  }   //Ending shirts object
}).then(scrapedLinks => {
let jsonTotalData = [];
for(let i=0;i<scrapedLinks.shirts.length;i +=1){
    shirtLinks.push(`${urlMain}${scrapedLinks.shirts[i].links}`);
  }
for(let i=0;i<shirtLinks.length;i +=1){
scrapeIt(shirtLinks[i],{
  Title:'title',
  Price:'span.price',
  ImageUrl: {
    selector: "img",
    attr: "src"
    }
}).then(jsondata => {
    shirt = jsondata;
    shirt.URL = `${scrapedLinks.shirts[i].links}`;  //Adding
    let setDate = new Date();
    shirt.Time = setDate;
    console.log(`Data scaped for shirt number ${i}`);
    shirtInfo.push(shirt);
    var csv = json2csv({ data: shirtInfo, fields: fields });
    //Creates a data folder if it doesn't exist.
    if (!fs.existsSync(dataFolder)){
        console.log('The data folder is created');
        fs.mkdirSync(dataFolder);
    }
    fs.writeFile(`data/${dateFormat}.csv`, csv, function(err) {
      if (err) throw err;
      console.log(`Shirt ${i} information is written in the csv`);
    });
  });
}

 })
.catch(error => {
    console.error(`Can't connect to the to URL ${urlMain}`);
    console.error(error.message);
});
