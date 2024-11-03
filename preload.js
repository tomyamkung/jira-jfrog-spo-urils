const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  fetchJiraTicket: (ticketNumber) => ipcRenderer.invoke('fetch-jira-ticket', ticketNumber),
});
