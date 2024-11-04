const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');
const fetch = require('isomorphic-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { exec } = require('child_process');
const config = require('./config.json');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height:600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('fetch-jira-ticket', async (event, ticketNumber) => {
  const jiraDomain = '';
  const username = "";
  const apiToken = "";

  try {
    const response = await fetch(`https://${jiraDomain}/rest/api/3/issue/${ticketNumber}` , {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${apiToken}`)}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch JIRA ticket: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const detailedDocumentLocation = data.fields.customfield_10048.content[0].content[0].text;
    const foundInRegion = data.fields.customfield_10049[0];

    // countryPathsからtypeを取得し、baseUrlsを使ってパスを作成
    const pathType = config.countryPaths[foundInRegion];
    const ticketPath = pathType ? config.baseUrls[pathType].replace('${ticketID}', ticketNumber) : config.default;

    return {
      detailedDocumentLocation,
      foundInRegion,
      ticketPath,
      raw: data
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
});
