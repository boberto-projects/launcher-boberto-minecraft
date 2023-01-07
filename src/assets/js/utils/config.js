/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

const pkg = require('../package.json');
const fetch = require("node-fetch")
class Config {
    GetApiUrl() {
        const configuration = pkg["bobertoApiConfig"] || {};
        const port = configuration.port || (protocol === "https" ? 443 : 80);
        const protocol = configuration.protocol || "http";
        const hostname = configuration.hostname || "localhost";
        return `${protocol}://${hostname}:${port}`
    }
    LauncherTitle() {
        return pkg.productname + "-" + pkg.version;
    }
}

export default new Config;