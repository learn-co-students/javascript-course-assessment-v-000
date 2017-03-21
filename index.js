
var myHeaders  = new Headers();
var myInit     = { headers: {token: "KTxlGVjkEQXSqYzzaCVqdcBZdGiDDTNN"
                 }};
var daysField  = document.getElementById('days');
var startField = document.getElementById("dt1");
var endField   = document.getElementById("dt2");
var chooser    = document.getElementById("dataChooser");
var chosen     = document.getElementById("chosen");
var zip        = document.getElementById("zip");

var defaultDays= 30;
daysField.value= defaultDays; //max amount the API will return
var choices      ;  //global to hold the data types for this station
var weatherInfo  ;

startField.addEventListener('change', function() {
	var value      = calculateDays(this.value, endField.value);
    endField.value = formatDate(addDays(this.value,defaultDays));
	}, false);


choice.addEventListener('change', function() {
	var value = $(this).find("option:selected").text();
    var desc  = $(this).find("option:selected")[0].title;
    chosen.innerHTML = "<strong>"+desc+"</strong>";
	}, false);

function loadHeader() {  //loads the heade  info from the meta data
  var template = Handlebars.compile(document.getElementById("header-template").innerHTML);
  var result = template(weatherInfo.results[0]);
  document.getElementsByTagName("main")[0].innerHTML = result;
}

function getDataTypes(station) { //fetches the types of data to display
	var numDays = calculateDays(startField.value, endField.value);
	var start = startField.value;
	var end   = endField.value;

	var myRequest = new Request("https://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes?datasetid=PRECIP_15&locationid=ZIP:"+station, myInit);
	console.log(myRequest);
			fetch(myRequest)
			.then(res  => res.json())
			.then(json => {
				choices=json;
			    var templateChoices = Handlebars.compile(document.getElementById("weather-choices").innerHTML);
			    var result          = templateChoices(choices.results);
			    document.getElementById("choice").innerHTML += result;
			});
	}

function loadData() {  //loads the data into the page
	var numDays = calculateDays(startField.value, endField.value);
	var start   = startField.value;
	var end     = endField.value;
	var dataT   = $("#dataChooser").find("option:selected").text().trim();

	var myRequest = new Request("https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=PRECIP_15&datatypeid="+dataT+"&locationcategoryid=ZIP:"+zip.value+"&units=standard&startdate=" + start + "&enddate=" + end + "&limit=100", myInit);
	console.log(myRequest);
			fetch(myRequest)
			.then(res  => res.json())
			.then(json => {
				weatherInfo = json;
		try{
			  loadHeader();
		}
		catch(e){
			console.log("no data found");
		}
			  var templateMain = Handlebars.compile(document.getElementById("weather-template").innerHTML);
			    	var result = templateMain(weatherInfo.results);
			    	document.getElementsByTagName("main")[0].innerHTML = result;
			    	console.log(weatherInfo.results);
			});
	}

 $(document).ready(function () {
    getDataTypes("80401");

    });
