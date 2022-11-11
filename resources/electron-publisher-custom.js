const electronPublish = require('electron-publish');
const axios = require("axios")
const fs = require("fs")
const path = require("path")
var FormData = require('form-data');
const pkg = require("../package.json")
const axiosInstance = axios.create({
    baseURL: "http://localhost:5555/",
})

class Publisher extends electronPublish.Publisher {


    async upload(task) {
        let filename = path.basename(task.file)
        let url = "/launcher/upload/" + pkg.version + "/" + filename
        console.log('electron-publisher-custom', task.file);

        // var data = new FormData()
        // data.append('file', fs.createReadStream(task.file))

        axiosInstance.post(url, task.file, {
            headers: {
                'ApiKey': 'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp',
                //    ...data.getHeaders()
            },
            onUploadProgress: (event) => {

                let progress = Math.round(
                    (event.loaded * 100) / event.total
                );

                console.log(`File ${filename} is ${progress}% uploading...`)

            },
        })

    }
};
module.exports = Publisher;