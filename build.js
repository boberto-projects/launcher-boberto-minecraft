const builder = require('electron-builder')
const { productname } = require('./package.json')
builder.build({
    config: {
        "productName": "Boberto Minecraft Launcher",
        "appId": "Boberto Minecraft Launcher",
        "artifactName": "${productName}-${version}-${os}-${arch}.${ext}",
        "compression": "maximum",
        "generateUpdatesFilesForAllChannels": true,
        "asar": true,
        "directories": {
            "output": "dist",
            "buildResources": "publisher"
        },
        "files": [
            "src/**/*",
            "package.json",
            "LICENSE.md"
        ],
        "publish": [
            {
                "provider": "custom",
                "url": "http://localhost:5555/launcher/versions/latest"
            }
        ],
        "win": {
            "icon": "./src/assets/images/icon.ico",
            "target": [
                {
                    "target": "nsis",
                    "arch": [
                        "x64"
                    ]
                }
            ]
        },
        "nsis": {
            "oneClick": true,
            "allowToChangeInstallationDirectory": false,
            "createDesktopShortcut": true,
            "runAfterFinish": true
        },
        "mac": {
            "icon": "./src/assets/images/icon.icns",
            "category": "public.app-category.games",
            "target": [
                {
                    "target": "dmg",
                    "arch": [
                        "x64",
                        "arm64"
                    ]
                }
            ]
        },
        "linux": {
            "icon": "./src/assets/images/icon.png",
            "target": [
                {
                    "target": "AppImage",
                    "arch": [
                        "x64"
                    ]
                }
            ]
        }
    }

}).then(() => {
    console.log('Build finalizado')
}).catch(err => {
    console.error('Ocorreu um erro durante o build!', err)
})