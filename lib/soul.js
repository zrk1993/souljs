class Soul {

	constructor() {
		this.config = this.loadConfig();
		this.router = this.loadRouter();
		this.service = this.loadService();
		
	}
}

module.exports = new Soul();