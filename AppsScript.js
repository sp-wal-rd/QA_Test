function doPost(e) { return handleRequest(e); }
function doGet(e)  { return handleRequest(e); }

function handleRequest(e) {
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var sheet  = ss.getSheetByName("Sheet1") || ss.getActiveSheet();
  var params = e.parameter;

  var features = [];
  try { features = JSON.parse(params.summary); } catch(err) {}

  var customItems = [];
  try { customItems = JSON.parse(params.customItems); } catch(err) {}

  // ── Build header if sheet is empty ──
  if (sheet.getLastRow() === 0) {
    var header = [
      "Timestamp", "Report Heading", "Tester", "Build", "Notes",
      "Checked Count", "Submitted At"
    ];
    // One column per feature: "Result #2 - External memory used"
    features.forEach(function(f) {
      header.push("#" + f.sn + " - " + f.function + " | Result");
      header.push("#" + f.sn + " - " + f.function + " | Remark");
    });
    sheet.appendRow(header);
    // Freeze header row
    sheet.setFrozenRows(1);
  }

  // ── Build data row ──
  var row = [
    new Date(),
    params.heading      || "",
    params.tester       || "",
    params.build        || "",
    params.notes        || "",
    params.checkedCount || "",
    params.timestamp    || ""
  ];

  // Fill result + remark for every feature (selected or not)
  features.forEach(function(f) {
    row.push(f.selected ? (f.result || "—") : "");
    row.push(f.selected ? (f.remark || "")  : "");
  });

  sheet.appendRow(row);

  // ── Custom items: append to a separate sheet ──
  if (customItems.length > 0) {
    var cSheet = ss.getSheetByName("Custom Items") || ss.insertSheet("Custom Items");
    if (cSheet.getLastRow() === 0) {
      cSheet.appendRow(["Timestamp", "Report Heading", "Tester", "Item Name", "Spec", "Result"]);
    }
    customItems.forEach(function(c) {
      if (c.name) {
        cSheet.appendRow([new Date(), params.heading, params.tester, c.name, c.spec, c.result]);
      }
    });
  }

  return ContentService.createTextOutput(
    JSON.stringify({status: "ok"})
  ).setMimeType(ContentService.MimeType.JSON);
}