document.getElementById('fetchButton').addEventListener('click', async () => {
  const ticketNumber = document.getElementById('ticketNumberInput').value;
  try {
    const ticketData = await window.electronAPI.fetchJiraTicket(ticketNumber);
    document.getElementById('ticketData').textContent = JSON.stringify(ticketData, null, 2);
    document.getElementById('detailedDocumentLocation').textContent = ticketData.detailedDocumentLocation || 'N/A';
    document.getElementById('foundInRegion').textContent = ticketData.foundInRegion || 'N/A';
    document.getElementById('ticketPath').textContent = ticketData.ticketPath || 'N/A';
  } catch (error) {
    document.getElementById('ticketData').textContent = `Error: ${error.message}`;
  }
});
