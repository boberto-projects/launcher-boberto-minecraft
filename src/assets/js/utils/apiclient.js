const fetch = require("node-fetch")
const pkg = require('../package.json');
const axios = require("axios")

class ApiClient {

  constructor() {
    const configuration = pkg["bobertoApiConfig"] || {};
    this.apiKey = configuration.apiKey || process.env.ApiKey
    this.port = configuration.port || (protocol === "https" ? 443 : 80);
    this.protocol = configuration.protocol || "http";
    this.hostname = configuration.hostname || "localhost";
    this.baseUrl = `${this.protocol}:${this.port}/${this.hostname}`

    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-type": "application/json",
        'ApiKey': this.apiKey
      }
    });
  }

  async getManifest() {
    return await this.axios.get("/launcher", {
    }).then(res => res.json());
  }

  async getAllModPacks() {
    return await this.axios.get("/modpack", {
    }).then(res => res.json());
  }

  async getGlobalConfigs() {
    return await axios.get("/config", {
    }).then(res => res.json());
  }

  async getModPackById(id) {
    return await axios.get(`/modpack/${id}`, {
    }).then(res => res.json());
  }

  async getModPackFilesById(id, forceCache = false) {
    return await axios.get(`/modpack/files/${id}/${forceCache}`, {
    }).then(res => res.json());
  }

}

export default ApiClient;