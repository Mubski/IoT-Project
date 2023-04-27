/* MagicMirror² Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 */

let config = {
	//address: "localhost", 	// Address to listen on, can be:
	// address for remotecontrol
	address: "0.0.0.0",
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	//ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], 	// Set [] to allow all IP addresses
	// ipWhitelist changed for remotecontrol
	ipWhitelist: [],
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
	// local for armv6l processors, default
	//   starts serveronly and then starts chrome browser
	// false, default for all NON-armv6l devices
	// true, force serveronly mode, because you want to.. no UI on this device

	modules: [
    {
        module: 'MMM-Remote-Control',
        // uncomment the following line to show the URL of the remote control on the mirror
        position: 'bottom',
        // you can hide this module afterwards from the remote control itself
        config: {
            apiKey: '43af3ca318ae44ceb81e2f005e3834cd'
        }
    },
{
        module: 'MMM-YrNow',
        position: 'left',
        config: {
                locationId: '10-992935',
        showWeatherForecast: true
        }
},

{
        module: "MMM-Jast",
        position: "bottom_right",
        config: {
                currencyStyle: "code", // One of ["code", "symbol", "name"]
                fadeSpeedInSeconds: 3.5,
                lastUpdateFormat: "HH:mm",
                maxChangeAge: 1 * 24 * 60 * 60 * 1000,
                maxWidth: "100%",
                numberDecimalsPercentages: 1,
                numberDecimalsValues: 2,
                scroll: "vertical", // One of ["none", "vertical", "horizontal"]
                showColors: true,
                showCurrency: true,
                showChangePercent: true,
                showChangeValue: false,
                showChangeValueCurrency: false,
                showHiddenStocks: false,
                showLastUpdate: false,
                showPortfolioValue: false,
                showPortfolioGrowthPercent: false,
                showPortfolioGrowth: false,
                updateIntervalInSeconds: 300,
                useGrouping: false,
                virtualHorizontalMultiplier: 2,
                stocks: [
                        { name: "Okea", symbol: "OKEA.OL"},
						{ name: "Hermés", symbol: "RMS.PA"},
                        { name: "Aker BP", symbol: "AKRBP.OL"},
                        { name: "BTC", symbol: "BTC-USD"},
                        { name: "Equinor", symbol: "EQNR.OL"},
						{ name: "Okeanis", symbol: "OET.OL"},
						{ name: "PetroNor", symbol: "PNOR.OL"}
                ]
        }
},

{
    module: "newsfeed",
    position: "bottom_left", // This can be any of the regions. Best results in center regions.
    config: {
      // The config property is optional.
      // If no config is set, an example calendar is shown.
      // See 'Configuration options' for more information.

      feeds: [
        {
          title: "E24",
          url: "https://e24.no/rss2/?seksjon=boers-og-finans",

        },

      ],
    },
  },


  {     module: "helloworld",
      position: "top_right",
      config: {
                text: "<iframe src='https://mon.ruter.no/departures/59.92028272549638-10.949234785346919/N4Igrgzgpgwg9gGzAWwHYBkCGBPOYAuIAXAGaYLQA0IARnJgE4AmExA2qBPnAA4AKCTAGMoASRbsQAOQDKAJSIzu-QSKIBWACwAGAOwgAutSZRB2KEyWN8AFQCWyKMQBM26gAs7TExjuoorESgsgpKvALCUBo6+kRs0vJEAIpgOEQAnAAcmekAtACM+dq5AGp2EDxQDGBMINQhyanYGdmZBUW56HYICAH4DAAfyHUJCilpWTnt2gCiuQASphAk2AwjDePNk22Fs7kyAwwIdu6YAG6omOuJmy3ZuQDMeg+dh1CoEADWcADmAARnH6seo3Jp3PIPDolci9apMZSVVDXMZg7aPDoAMQAVlUmH4fjRsMjGhNshD8upSjCqjUEe9ibc0ZDKQBBdyQQwAX2oqBQNCqAHkSAARKA8axgBgBYjqaj4Oz4XrEEDQno0phnKB2enGcqYGi9Jg2BiYD48OAMfAAWTgJkCbCMIHe+sNxH6YCgHi8UGNwk+8CQaGIZAoUG5nGUERE4nto0UkdUUXUWV0zmJYRUkSIOnU6nTCazADZ8oWHg98+FExp0upMtpDMZTDgLFZLfZHC43CBPN53l1-IFgNyQLzkPyGELReLLZLpRo5QqlUQQAB1ALQCh-HiCCDAkB4iAuiy+s0W622ucO6jOg0WYPkKjd72+oT+xAoJGkB9hx2ahgQOw4E-ZxOSAA' style='border: solid black; height: 350px; width: 350px;'></iframe>"
               }
 },

   {
    module: "compliments",
    position: "lower_third", // This can be any of the regions.
    // Best results in one of the middle regions like: lower_third
		config: {
		}
  },

	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
