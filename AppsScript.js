function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  var params = e.parameter;

  var row = [
    new Date(),
    params.heading,
    params.tester,
    params.build,
    params.notes,
    params.checkedCount,
    params.summary,
    params.customItems,
    params.timestamp
  ];

  sheet.appendRow(row);

  return ContentService.createTextOutput(
    JSON.stringify({status: "ok"})
  ).setMimeType(ContentService.MimeType.JSON);
}