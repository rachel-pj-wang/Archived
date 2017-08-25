const Https = require('https');



//To zip, must go into directory and then do zip -r lambdaTestFunction.zip *
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
          buildSpeechletResponse("Welcome to trip time", false),
          {}
        )
      )

      break;

      case "IntentRequest":
      // Intent Request

      switch(event.request.intent.name) {
        case "GetDistance":{
          try{
            deviceId = event.context.System.device.deviceId;
            consentToken = event.context.System.user.permissions.consentToken
            path = "/v1/devices/" + deviceId + "/settings/address";
            request = getRequestOptions(path, consentToken);

            Https.get(request, (response) => {
              response.on('data', (data) => {
                addressJSON  = JSON.parse(data); //when this is "let" then it results in error

                OrgState = addressJSON.stateOrRegion;
                OrgCity = addressJSON.city +"%20";
                OrgAddressLine1 = addressJSON.addressLine1;
                OrgZipCode = addressJSON.postalCode;



                DestAddressLine1 = "40 Honey Locust" //do something with "context" and slot shit
                DestCity = "Irvine"

                var from = OrgAddressLine1 + "," + OrgCity
                var dest = DestAddressLine1 + "," + DestCity

                var endpoint3 = "https://www.mapquestapi.com/directions/v2/route?key=Eo2y0fnG8rFOL2LNtxzlq6KMEC4pwP04&from="+ from+ "&to=" + dest + "&routeType=fastest"


                var  secondBody=""
                Https.get(endpoint3, (response) => {
                  response.on('data', (chunk1) => { secondBody += chunk1 }     )
                  response.on('end', () => {
                    var mapquestAPI = JSON.parse(secondBody)

                    var time = mapquestAPI.route.realTime;
                    var minuteConversion = Math.trunc((parseInt(time)/60))
                    context.succeed(
                      generateResponse(
                        buildSpeechletResponse("It will take approximately "+ minuteConversion + " minutes to drive there.", true),
                        {}
                      )
                    )

              })
            })
          })
            })
          }
          catch(err){
            //MAKE ERROR FUNCTION HERE
            getLocationError(context)

          }

          break;

        }

        //////////




          case "GetTest":
          {

            var address = event.request.intent.slots.Destination.value
            console.log(address)
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



    function getLocationError(context){
      context.succeed(
        generateResponse(
          buildSpeechletResponse("In order to tell you this information, you'll need to enable location services in the Amazon Alexa App.", true),
          {}
        )
      )
    }
