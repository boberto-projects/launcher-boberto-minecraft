/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';

import { logger, database, changePanel, ApiClient } from '../utils.js';

const { Launch, Status } = require('minecraft-java-core');
const { ipcRenderer } = require('electron');
const launch = new Launch();
const pkg = require('../package.json');

const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? `${process.env.HOME}/Library/Application Support` : process.env.HOME)

class Home {
    static id = "home";
    async init(config, news) {
        this.config = config
        this.apiClient = new ApiClient();
        this.news = await news
        this.database = await new database().init();

        this.initLaunch();
        this.initModPackList();
        this.initStatusServer();
        this.initBtn();
    }

    async initModPackList() {
        let modPackSelector = document.querySelector(".select-modpacks")
        let modpacks = await this.apiClient.getAllModPacks();
        let self = this

        if (modpacks.length === 0) {
            modPackSelector.innerHTML += `<option value="-1">Nenhum modpack disponível</option>`
        } else {
            modPackSelector.innerHTML += `<option value="-1">Nenhum modpack selecionado</option>`
        }

        for (let i = 0; i < modpacks.length; i++) {

            let modpackName = modpacks[i].name
            let modpackDefault = modpacks[i].isDefault

            // if (modpackDefault) {
            //     config.modpack_selected = modpack[i]
            // }

            modPackSelector.innerHTML += `<option value="${modpacks[i].id}">${modpackName}</option>`
        }
        modPackSelector.addEventListener('change', function () {
            let modpackSelected = modpacks.find(e => e.id == this.value)
            if (modpackSelected == null) {
                return;
            }
            console.log('teste ' + this.value)
            self.database.update({ uuid: "1234", ...modpackSelected }, 'modpack-selected');
        })
    }

    async initLaunch() {
        document.querySelector('.play-btn').addEventListener('click', async () => {
            let urlpkg = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url;
            let uuid = (await this.database.get('1234', 'accounts-selected')).value;
            let account = (await this.database.get(uuid.selected, 'accounts')).value;
            let ram = (await this.database.get('1234', 'ram')).value;
            let javaPath = (await this.database.get('1234', 'java-path')).value;
            let javaArgs = (await this.database.get('1234', 'java-args')).value;
            let Resolution = (await this.database.get('1234', 'screen')).value;
            let launcherSettings = (await this.database.get('1234', 'launcher')).value;
            let modpack_selected = (await this.database.get('1234', 'modpack-selected')).value;
            console.log(JSON.stringify(modpack_selected))
            let screen;

            let playBtn = document.querySelector('.play-btn');
            let info = document.querySelector(".text-download")
            let progressBar = document.querySelector(".progress-bar")

            if (Resolution.screen.width == '<auto>') {
                screen = false
            } else {
                screen = {
                    width: Resolution.screen.width,
                    height: Resolution.screen.height
                }
            }

            let modpack_dir = `${dataDirectory}/${pkg.directory}/${modpack_selected.directory}`
            // let url = `${pkg.url}/modpack/files/${modpack_selected.id}/false`

            if (this.config.game_url === "" || this.config.game_url === undefined || this.config.game_url === null) {
                var url = `${pkg.url}/modpack/files/${modpack_selected.id}/false`
            } else {
                var url = config.game_url
            }

            console.log(url)
            let opts = {
                url: url,//this.config.game_url === "" || this.config.game_url === undefined ? `${urlpkg}/files` : this.config.game_url,
                authenticator: account,
                path: modpack_dir,
                version: modpack_selected.gameVersion,
                detached: launcherSettings.launcher.close === 'close-all' ? false : true,
                java: true,
                javapath: javaPath.path,
                args: [...javaArgs.args],
                screen,
                modde: true,
                verify: false,
                ignored: [],
                memory: {
                    min: `${ram.ramMin * 1024}M`,
                    max: `${ram.ramMax * 1024}M`
                }
            }

            playBtn.style.display = "none"
            info.style.display = "block"
            launch.Launch(opts);

            launch.on('progress', (DL, totDL) => {
                progressBar.style.display = "block"
                document.querySelector(".text-download").innerHTML = `Téléchargement ${((DL / totDL) * 100).toFixed(0)}%`
                ipcRenderer.send('main-window-progress', { DL, totDL })
                progressBar.value = DL;
                progressBar.max = totDL;
            })

            launch.on('speed', (speed) => {
                console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
            })

            launch.on('check', (e) => {
                progressBar.style.display = "block"
                document.querySelector(".text-download").innerHTML = `Vérification ${((DL / totDL) * 100).toFixed(0)}%`
                progressBar.value = DL;
                progressBar.max = totDL;

            })

            launch.on('data', (e) => {
                new logger('Minecraft', '#36b030');
                if (launcherSettings.launcher.close === 'close-launcher') ipcRenderer.send("main-window-hide");
                progressBar.style.display = "none"
                info.innerHTML = `Demarrage en cours...`
                console.log(e);
            })

            launch.on('close', () => {
                if (launcherSettings.launcher.close === 'close-launcher') ipcRenderer.send("main-window-show");
                progressBar.style.display = "none"
                info.style.display = "none"
                playBtn.style.display = "block"
                info.innerHTML = `Vérification`
                new logger('Launcher', '#7289da');
                console.log('Close');
            })
        })
    }

    async initStatusServer() {
        let nameServer = document.querySelector('.server-text .name');
        let serverMs = document.querySelector('.server-text .desc');
        let playersConnected = document.querySelector('.etat-text .text');
        let online = document.querySelector(".etat-text .online");
        let serverPing = await new Status("boberto.net", 25565).getStatus();

        if (!serverPing.error) {
            nameServer.textContent = "boberto.net"; //this.config.status.nameServer;
            serverMs.innerHTML = `<span class="green">Online</span> - ${serverPing.ms}ms`;
            online.classList.toggle("off");
            playersConnected.textContent = serverPing.playersConnect;
        } else if (serverPing.error) {
            nameServer.textContent = 'Servidor indisponível';
            serverMs.innerHTML = `<span class="red">Offline</span>`;
        }
    }

    initBtn() {
        document.querySelector('.settings-btn').addEventListener('click', () => {
            changePanel('settings');
        });
    }

    async getdate(e) {
        let date = new Date(e)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let allMonth = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
        return { year: year, month: allMonth[month - 1], day: day }
    }
}
export default Home;