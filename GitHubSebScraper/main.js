let url = "https://github.com/topics";
const request = require("request");
const cheerio = require("cheerio");
const getReposPageHtml = require("./reposPage");
request(url, cb);

function cb(err, response, html) {
    if (err) {
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("page not Found");
    } 
    else {
        // console.log(html);
        getTopicLink(html);
    }
}
// https://github.com/topics/git 
function getTopicLink(html) {
    let $ = cheerio.load(html);
    let linkElemArr = $(".no-underline.d-flex.flex-column.flex-justify-center")
    for (let i = 0; i < linkElemArr.length; i++) {
        let href = $(linkElemArr[i]).attr("href");
        let topic = href.split("/").pop();
        // href called a link 
        // console.log(href);
        // let fullLink = "https://github.com/" + href;
        let fullLink = `https://github.com/${href}`;
        // always put home page link here
        // console.log(fullLink);
        getReposPageHtml(fullLink,topic);
    }
}