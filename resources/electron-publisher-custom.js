const electronPublish = require('electron-publish');
var FormData = require('form-data');
const pkg = require("../package.json")
const { httpExecutor } = require("builder-util/out/nodeHttpExecutor");
const mime = require("mime");
const { stat } = require("fs-extra");
const { Arch } = require("builder-util");
const { basename, join } = require("path");
const { configureRequestOptions } = require("builder-util-runtime");
const { HttpPublisher } = require("electron-publish/out/publisher");


class Publisher extends HttpPublisher {


    async upload(task) {
        const fileName =
            (this.useSafeArtifactName ? task.safeArtifactName : null) ||
            basename(task.file);

        // FIXME: better os detection
        let os;
        switch (task.packager.platform.name) {
            case "windows":
                os = "win";
                break;
            default:
                os = task.packager.platform.name;
                break;
        }
        const fileStat = await stat(task.file);
        const progressBar = this.createProgressBar(fileName, fileStat.size);
        await this.doUpload(
            fileName,
            task.arch || Arch.x64,
            fileStat.size,
            (request, reject) => {
                if (progressBar != null) {
                    // reset (because can be called several times (several attempts)
                    progressBar.update(0);
                }
                return this.createReadStreamAndProgressBar(
                    task.file,
                    fileStat,
                    progressBar,
                    reject
                ).pipe(request);
            },
            task.file,
            os
        );
    }

    async doUpload(fileName, arch, dataLength, requestProcessor, file, os) {
        const packageJsonContent = require(join(
            this.context.packager.appDir,
            "package.json"
        ));
        const appInfo = this.context.packager.appInfo;
        const configuration = packageJsonContent["bobertoApiConfig"] || {};
        const hostname = configuration.hostname || "localhost";
        const protocol = configuration.protocol || "http";
        const port = configuration.port || (protocol === "https" ? 443 : 80);
        const method = configuration.method || "POST";
        const pathPattern = configuration.path || "/launcher/upload/${version}/${name}";
        const connectionOptions = configuration.connectionOptions || {};
        const headers = configuration.headers || {};
        const apiKey = configuration.apiKey
        const archName = Arch[arch];
        const path = pathPattern
            .replace(/\$\{version\}/g, appInfo.version)
            .replace(/\$\{name\}/g, fileName)

        return await httpExecutor.doApiRequest(
            configureRequestOptions({
                hostname,
                protocol: `${protocol}:`,
                port,
                path,
                method,
                headers: {
                    "ApiKey": apiKey,
                    "X-File-Name": file ? basename(file) : fileName,
                    "Content-Type": mime.getType(fileName) || "application/octet-stream",
                    "Content-Length": dataLength
                },
                ...connectionOptions
            }),
            this.context.cancellationToken,
            requestProcessor
        );
    }

}
module.exports = {
    default: Publisher
};