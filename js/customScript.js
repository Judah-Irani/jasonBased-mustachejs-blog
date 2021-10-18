import {path_variables} from "./path_variables.js";

var pageNumber = 1;
var allCatdata = {};
var newCat = {"content": []};
var totPag = 0;
// var api = 'https://raw.githubusercontent.com/Musaib/responsigation/master/navigation.json';
var api = path_variables.tenantPath + path_variables.publicPath +  path_variables.blogurl;
dataLoad();

function getJson(url) {
    return $.getJSON(url);
}

function dataLoad() {
    getJson(api).then(data => {
        allCatdata = data;
        totPag = data.page.totalPages;
        fixThis(data);
    });
}

function fixThis(data) {
    delete data.page;
    delete data.links;
    data.content = data.content.filter(val => val.type == 'ARTICLE');
    let date = new Date(data.content[0].createdAt);
    data.content[0].date = date.getDate();
    data.content[0].month = date.toDateString().substr(4, 3);
    console.log(data);
    setParentData(data);

}

function setParentData(data){
    var nav = $('#nav');
    var outerTemplate = $("#outerTemplate").html();
    var innerTemplate = $("#innerTemplate").html();
    var subCategoryTemplate = $("#subCategoryTemplate").html();
    var rendered = Mustache.render(outerTemplate, data, {
        "innerTemplate": innerTemplate, subCategoryTemplate
    });
    nav.html(rendered);
    Mustache.Formatters = {
        date: function( str) {
            var dt = new Date( parseInt( str.substr(6, str.length-8), 10));
            return (dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear());
        }
    };
}


