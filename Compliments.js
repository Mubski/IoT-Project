/* MagicMirror²
 * Module: Compliments
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("compliments", {
	// Module config defaults.
	defaults: {
		compliments: {
			morning: ["Good Morning"],
			prenoon: ["Formiddag"],
			afternoon: ["Ettermiddag"],
			evening: ["Kveld"],
			night: ["Natt"],
			"....-01-01": ["Happy new year!"]

		},
		holidayYear: new Date().getFullYear(),
		countryCode: "nor",
		updateInterval: 30000,
		initialLoadDelay: 5250,
        remoteFile: null,
        fadeSpeed: 4000,
        morningStartTime: 6,
        morningEndTime: 9,
        prenoonStartTime: 9,
        prenoonEndTime: 12,
        afternoonStartTime: 12,
        afternoonEndTime: 18,
        eveningStartTime: 18,
        eveningEndTime: 22,
        nightStartTime: 22,
        nightEndTime: 6,
        random: true
	},
	lastIndexUsed: -1,
	// Set currentweather from module
	currentWeatherType: "",

	// Define required scripts.
	getScripts: function () {
		return ["moment.js"];
	},

	// Define start sequence.
	start: async function () {
		Log.info(`Starting module: ${this.name}`);
		this.url = this.getHolidayUrl();
		this.today = "";
		this.getHoliday();

		this.lastComplimentIndex = -1;

		if (this.config.remoteFile !== null) {
			const response = await this.loadComplimentFile();
			this.config.compliments = JSON.parse(response);
			this.updateDom();
		}

		// Schedule update timer.
		setInterval(() => {
			this.updateDom(this.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/**
	 * Generate a random index for a list of compliments.
	 *
	 * @param {string[]} compliments Array with compliments.
	 * @returns {number} a random index of given array
	 */
	randomIndex: function (compliments) {
		if (compliments.length === 1) {
			return 0;
		}

		const generate = function () {
			return Math.floor(Math.random() * compliments.length);
		};

		let complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/**
	 * Retrieve an array of compliments for the time of the day.
	 *
	 * @returns {string[]} array with compliments for the time of the day.
	 */
	getHolidayUrl: function() {
        var url = null;
        var today = new Date();
        var holidayYear = today.getFullYear();
        var countryCode = this.config.countryCode.toLowerCase();
        url = "http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForYear&year=" + holidayYear + "&country=" + countryCode + "&region=";
        return url;
    },

    getHoliday: function() {
		this.sendSocketNotification('GET_HOLIDAY', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "HOLIDAY_RESULT") {
            this.processHoliday(payload);
			this.updateDom(this.config.fadeSpeed);
			this.updateDom(this.config.initialLoadDelay);
        }
    },

	processHoliday: function(data) {
        //this.today = data.Today;
        this.holiday = data;
        this.loaded = true;
    },

	complimentArray: function () {
		var hour = moment().hour();
		// TEST FOR KLOKKESLETT
		const date = moment().format("YYYY-MM-DD");
		let compliments = [];

		// Add time of day compliments
		if (hour >= this.config.morningStartTime && hour < this.config.morningEndTime && this.config.compliments.hasOwnProperty("morning")) {
			compliments = [...this.config.compliments.morning];
		} else if (hour >= this.config.prenoonStartTime && hour < this.config.prenoonEndTime && this.config.compliments.hasOwnProperty("prenoon")) {
			compliments = [...this.config.compliments.prenoon];
		} else if (hour >= this.config.afternoonStartTime && hour < this.config.afternoonEndTime && this.config.compliments.hasOwnProperty("afternoon")) {
			compliments = [...this.config.compliments.afternoon];
		} else if (hour >= this.config.eveningStartTime && hour < this.config.eveningEndTime && this.config.compliments.hasOwnProperty("evening")) {
			compliments = [...this.config.compliments.evening];
		} else if (hour >= this.config.nightStartTime || hour < this.config.nightEndTime && this.config.compliments.hasOwnProperty("night")) {
			compliments = [...this.config.compliments.night];
		}

		// Add compliments based on weather
		if (this.currentWeatherType in this.config.compliments) {
			Array.prototype.push.apply(compliments, this.config.compliments[this.currentWeatherType]);
		}

		// Add compliments for anytime
		Array.prototype.push.apply(compliments, this.config.compliments.anytime);

		// Add compliments for special days
		for (let entry in this.config.compliments) {
			if (new RegExp(entry).test(date)) {
				Array.prototype.push.apply(compliments, this.config.compliments[entry]);
			}
		}

		return compliments;
	},

	/**
	 * Retrieve a file from the local filesystem
	 *
	 * @returns {Promise} Resolved when the file is loaded
	 */
	loadComplimentFile: async function () {
		const isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			url = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		const response = await fetch(url);
		return await response.text();
	},

	/**
	 * Retrieve a random compliment.
	 *
	 * @returns {string} a compliment
	 */
	getRandomCompliment: function () {
		// get the current time of day compliments list
		const compliments = this.complimentArray();
		// variable for index to next message to display
		let index;
		// are we randomizing
		if (this.config.random) {
			// yes
			index = this.randomIndex(compliments);
		} else {
			// no, sequential
			// if doing sequential, don't fall off the end
			index = this.lastIndexUsed >= compliments.length - 1 ? 0 : ++this.lastIndexUsed;
		}
		var compliment = compliments[index] || "";
		var today = new Date();
		// TEST FOR DATO
		today = new Date();
		if (this.holiday) {
			this.holiday.forEach (holiday => {
				var date = new Date(holiday.date.year, holiday.date.month-1, holiday.date.day, 0, 0, 0);
				if (holiday.date.day == today.getDate() && holiday.date.month-1 == today.getMonth() && holiday.date.year == today.getFullYear()) {
					compliment += " I dag er det " + holiday.localName + "!";
				}
			});
		}
		return compliment;
	},

	// Override dom generator.
	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright pre-line";
		// get the compliment text
		const complimentText = this.getRandomCompliment();
		// split it into parts on newline text
		const parts = complimentText.split("\n");
		// create a span to hold the compliment
		const compliment = document.createElement("span");
		// process all the parts of the compliment text
		for (const part of parts) {
			if (part !== "") {
				// create a text element for each part
				compliment.appendChild(document.createTextNode(part));
				// add a break
				compliment.appendChild(document.createElement("BR"));
			}
		}
		// only add compliment to wrapper if there is actual text in there
		if (compliment.children.length > 0) {
			// remove the last break
			compliment.lastElementChild.remove();
			wrapper.appendChild(compliment);
		}
		return wrapper;
	},

	// Override notification handler.
	notificationReceived: function (notification, payload, sender) {
		if (notification === "CURRENTWEATHER_TYPE") {
			this.currentWeatherType = payload.type;
		}
	}
});
