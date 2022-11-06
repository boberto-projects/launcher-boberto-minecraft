const fetch = require("node-fetch")
const pkg = require('../package.json');

class ApiClient {

  constructor() {
    this.url = pkg.url
    this.apiKey = "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp";
  }

  async getManifest() {
    return await fetch(`${this.url}/launcher`, {
      method: 'GET',
      headers: {
        "ApiKey": this.apiKey
      }
    }).then(res => res.json());
  }

  async getAllModPacks() {
    return await fetch(`${this.url}/modpack`, {
      method: 'GET',
      headers: {
        "ApiKey": this.apiKey
      }
    }).then(res => res.json());
  }

  async getGlobalConfigs() {
    return await fetch(`${this.url}/config`, {
      method: 'GET',
      headers: {
        "ApiKey": this.apiKey
      }
    }).then(res => res.json());
  }

  async getModPackById(id) {
    return await fetch(`${this.url}/modpack/${id}`, {
      method: 'GET',
      headers: {
        "ApiKey": this.apiKey
      }
    }).then(res => res.json());
  }

  async getModPackFilesById(id, forceCache = false) {
    return await fetch(`${this.url}/modpack/files/${id}/${forceCache}`, {
      method: 'GET',
      headers: {
        "ApiKey": this.apiKey
      }
    }).then(res => res.json());
  }

}

export default ApiClient;