const Https = require('https')

exports.handler = (event, context) => {

  var options = null;
  var state ="";
  var city = "";
  var addressLine1 = "";
  var zipCode = "";
  var addressJSON =null


  var deviceId= null
  var consentToken= null
  var path= null
  var request = null
  var stateNameJSON = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
  }


  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
      // Launch Request
      console.log(`LAUNCH REQUEST`)
      context.succeed(
        generateResponse(
          buildSpeechletResponse("Welcome to political pundit.", true),
          {}
        )
      )

      break;

      case "IntentRequest":
      // Intent Request

      switch(event.request.intent.name) {
        case "GetHouse":{

          deviceId = event.context.System.device.deviceId;
          consentToken = event.context.System.user.permissions.consentToken
          path = "/v1/devices/" + deviceId + "/settings/address";
          request = getRequestOptions(path, consentToken);

          Https.get(request, (response) => {
            response.on('data', (data) => {
              addressJSON  = JSON.parse(data); //when this is "let" then it results in error

              state = addressJSON.stateOrRegion;
              city = addressJSON.city +"%20";
              addressLine1 = addressJSON.addressLine1;
              zipCode = addressJSON.postalCode;

              endpoint2 = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + addressLine1 +"&includeOffices=true&levels=country";


              body = ""
              Https.get(endpoint2, (response) => {
                response.on('data', (chunk) => { body += chunk })
                response.on('end', () => {
                  var namesJSON = JSON.parse(body);
                  var congressmanName = namesJSON.officials[4].name;
                  var congressmanParty = namesJSON.officials[4].party;
                  var districtNumber = namesJSON.officials[4].district;
                  var RepStatement = "Your Congressional representative's name is " + congressmanName +", and is of the " + congressmanParty + " party!  There are 435 representatives in the House of Representatives.";

                  context.succeed(
                    generateResponse(
                      buildSpeechletResponse(RepStatement, true),
                      {}
                    )
                  )
                })
              })


            })
          })

          break;
        }




        case "GetCongress":{
          deviceId = event.context.System.device.deviceId;

          consentToken = event.context.System.user.permissions.consentToken;
          path = "/v1/devices/" + deviceId + "/settings/address";
          request = getRequestOptions(path, consentToken);

          Https.get(request, (response) => {
            response.on('data', (data) => {
              addressJSON  = JSON.parse(data); //when this is "let" then it results in error
              state = addressJSON.stateOrRegion;
              city = addressJSON.city +"%20";
              addressLine1 = addressJSON.addressLine1;
              zipCode = addressJSON.postalCode;

              endpoint2 = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + addressLine1 +"&includeOffices=true&levels=country";


              body = ""
              Https.get(endpoint2, (response) => {
                response.on('data', (chunk) => { body += chunk })
                response.on('end', () => {
                  var namesJSON = JSON.parse(body);
                  var congressmanName = namesJSON.officials[4].name;
                  var congressmanParty = namesJSON.officials[4].party;
                  var districtNumber = namesJSON.officials[4].district;

                  var RepStatement = "Your Congressional representative's name is " + congressmanName +", and is of the " + congressmanParty + " party!  ";

                  var senate1Name = namesJSON.officials[2].name;
                  var senate1Party = namesJSON.officials[2].party;
                  var senate2Name = namesJSON.officials[3].name;
                  var senate2Party = namesJSON.officials[3].party;

                  var stateFullName  = stateNameJSON[state]


                  var SenateStatement = stateFullName + "'s U.S. senators are " + senate1Name + " of the " + senate1Party+ " party, as well as " + senate2Name + " of the " + senate2Party + " party.";
                  context.succeed(
                    generateResponse(
                      buildSpeechletResponse(RepStatement + SenateStatement, true),
                      {}
                    )
                  )
                })
              })



            })
          })

          break;
        }


        case "GetUnemploymentRate":{
          var apiKey = "c7b588404722445b9215590c467e8dcb";
          break;}

          case "GetPollingPrecinct":{



               deviceId = event.context.System.device.deviceId;
            consentToken = event.context.System.user.permissions.consentToken
            path = "/v1/devices/" + deviceId + "/settings/address";
            request = getRequestOptions(path, consentToken);

            Https.get(request, (response) => {
              response.on('data', (data) => {
                addressJSON  = JSON.parse(data); //when this is "let" then it results in error

                state = addressJSON.stateOrRegion;
                city = addressJSON.city ;
                addressLine1 = addressJSON.addressLine1;
                zipCode = addressJSON.postalCode;


            //var endpoint2 = "https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=40%20Honey%20Locust%20Irvine%20CA&electionId=2000"
            var endpoint2 = "https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDZxqzVTlhxpsj5mwg1C2JOblc29YndibA&address=" + addressLine1 +"%20"+ city +"%20"+ state+"&electionId=2000";


            body = ""
            Https.get(endpoint2, (response) => {
              response.on('data', (chunk) => { body += chunk })
              response.on('end', () => {
                var namesJSON = JSON.parse(body);

                var addressLinePoll = namesJSON.pollingLocations[0].address.line1;
                var cityPoll = namesJSON.pollingLocations[0].address.city;
                var statePoll = stateNameJSON[namesJSON.pollingLocations[0].address.state];
                var zipPoll = namesJSON.pollingLocations[0].address.zip;
                var from = addressLine1 + "," + city + "," + state;

                var to = addressLinePoll+ "," + cityPoll+ "," +statePoll;

                var endpoint3 = "https://www.mapquestapi.com/directions/v2/route?key=Eo2y0fnG8rFOL2LNtxzlq6KMEC4pwP04&from="+ from+ "&to=" + to + "&routeType=fastest"
               //var endpoint3= "https://www.mapquestapi.com/directions/v2/route?key=Eo2y0fnG8rFOL2LNtxzlq6KMEC4pwP04&from=40 Honey Locust,Irvine,CA&to=1 Civic Center Plz,Irvine,CA&routeType=fastest"
             //var endpoint3 ="https://www.mapquestapi.com/directions/v2/route?key=Eo2y0fnG8rFOL2LNtxzlq6KMEC4pwP04&from=2425 Blake Street,Berkeley,CA&to=40 Honey Locust,Irvine,CA&routeType=fastest" //DON'T FORGET THE S IN HTTPS LMAOOO
                var  secondBody=""
                Https.get(endpoint3, (response) => {
                  response.on('data', (chunk1) => { secondBody += chunk1 }     )
                  response.on('end', () => {
                    var mapquestAPI = JSON.parse(secondBody)

                    var time = mapquestAPI.route.realTime;
                    var minuteConversion = Math.trunc((parseInt(time)/60))


                    context.succeed(
                      generateResponse(
                        buildSpeechletResponse("Your designated polling precinct is located at: " + addressLinePoll + " in " + cityPoll + ", " + statePoll + ".  The precinct is only a " + minuteConversion+ " minute drive away from your house!", true),
                        {}
                      )
                    )
                  })
                })
              })
            })
          })
        })
        break;

      }

      case "GetPresident":{
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Donald J. Trump is the 45th President of the United States.", true),
            {}
          )

      }

      case "GetNationalDebt":{
        var nationalDebtLink = "https://www.treasurydirect.gov/NP_WS/debt/current?format=json"

        Https.get(nationalDebtLink, (response) => {
          response.on('data', (data) => {
            var natDebtJSON = JSON.parse(data)
            var debt = natDebtJSON.totalDebt


                context.succeed(
                  generateResponse(
                    buildSpeechletResponse("As of today, The United States collectively owes: $" +debt, true),
                    {}
                  )
                )
              })
            })

            break;

      }

      case "GetTest":{
        var endpoint3= "https://www.mapquestapi.com/directions/v2/route?key=Eo2y0fnG8rFOL2LNtxzlq6KMEC4pwP04&from=40 Honey Locust,Irvine,CA&to=1 Civic Center Plz,Irvine,CA&routeType=pedestrian"
        var  secondBody=""
        Https.get(endpoint3, (response) => {
          response.on('data', (chunk1) => { secondBody += chunk1 }     )
          response.on('end', () => {
            var mapquestAPI = JSON.parse(secondBody)

            var time = mapquestAPI.route.realTime;
            console.log(time)

          })
        })


        break;
      }




      default:
      throw "Invalid intent";
    }

    break;

    case "SessionEndedRequest":
    // Session Ended Request
    console.log(`SESSION ENDED REQUEST`)
    break;

    default:
    context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

  }

} catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}

getRequestOptions = (path, consentToken) => {
   return {
   hostname: "api.amazonalexa.com",
           path: path,
           method: 'GET',
           'headers': {
               'Authorization': 'Bearer ' + consentToken}
             }
}
