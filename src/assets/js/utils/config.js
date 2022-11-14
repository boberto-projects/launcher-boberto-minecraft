/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

const pkg = require('../package.json');
const fetch = require("node-fetch")
class Config {
    // GetConfig() {
    //     return new Promise((resolve, reject) => {
    //         fetch(config).then(config => {
    //             return resolve(config.json());
    //         }).catch(error => {
    //             return reject(error);
    //         })
    //     })
    // }

    // async GetNews() {
    //     let rss = await fetch(news);
    //     if (rss.status === 200) {
    //         try {
    //             let news = await rss.json();
    //             return news;
    //         } catch (error) {
    //             return false;
    //         }
    //     } else {
    //         return false;
    //     }
    // }
    GetApiUrl() {
        const configuration = pkg["bobertoApiConfig"] || {};
        const port = configuration.port || (protocol === "https" ? 443 : 80);
        const protocol = configuration.protocol || "http";
        const hostname = configuration.hostname || "localhost";
        return `${protocol}://${hostname}:${port}`
    }
    LauncherTitle() {
        return pkg.preductname + "-" + pkg.version;
    }
}

export default new Config;