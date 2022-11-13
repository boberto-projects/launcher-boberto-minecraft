const fetch = require("node-fetch")
const pkg = require('../package.json');
const axios = require("axios")
require('dotenv').config()

class ApiClient {

  constructor() {
    const configuration = pkg["bobertoApiConfig"] || {};
    this.apiKey = configuration.apiKey || process.env.ApiKey
    this.port = configuration.port || (protocol === "https" ? 443 : 80);
    this.protocol = configuration.protocol || "http";
    this.hostname = configuration.hostname || "localhost";
    this.baseUrl = `${this.protocol}://${this.hostname}:${this.port}`
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-type": "application/json",
        'ApiKey': this.apiKey
      }
    });
  }
  async getConfig() {
    return await this.axios.get("/config").then(response => response.data)
  }

  async getManifest() {
    return await this.axios.get("/launcher").then(response => response.data)
  }

  async getAllModPacks() {
    return await this.axios.get("/modpack").then(response => response.data)
  }

  async getGlobalConfigs() {
    return await axios.get("/config").then(response => response.data)
  }

  async getModPackById(id) {
    return await axios.get(`/modpack/${id}`).then(response => response.data)
  }

  async getModPackFilesById(id, forceCache = false) {
    return await axios.get(`/modpack/files/${id}/${forceCache}`).then(response => response.data)
  }

}

export default ApiClient;