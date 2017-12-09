//  Create a Google Spreadsheet
//
//  In the first row, insert the input field names into the columns. The column names must matching 
//  the form's field names (exactly matching case)
//  IMPORTANT NOTE: headers (first row) MUST MATCH key names, for example:
//  <input name="email">, then in one of the column you must have also have email. Otherwise that
//  data will not be captured
//
//  Add TIMESTAMP field to one of the column
//
//  0. Open the script editor. Tools > Script editor. Replace the entire contents of the editor 
//     with this script.
//
//  1. Enter sheet name where data is to be written below
    var SHEET_NAME = "Sheet1";
         
//  2. Find your sheet's ID 
//     If this is your spreadsheet's URL https://docs.google.com/spreadsheets/d/abc1234567/edit#gid=0 
//     then the ID is abc1234567. DO NOT copy the URL of the script editor.
//
//  3. Replace __SHEET_ID__ with your ID
	var sheetId = "__SHEET_ID__";
//
//  4. Run > setup
//
//  5. Publish > Deploy as web app 
//    - enter Project Version name and click 'Save New Version' 
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously) 
//
//  6. Copy the 'Current web app URL' and post this in your form/script action 
//


var SCRIPT_PROP = PropertiesService.getScriptProperties();
 
function doGet(e){
  return handleResponse(e);
}
 
function doPost(e){
  return handleResponse(e);
}
 
function handleResponse(e) {
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = []; 
    for (i in headers){
      if (headers[i] == "TIMESTAMP"){
        row.push(new Date());
      } else {
        row.push(e.parameter[headers[i]]);
      }
    }
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
 
function setup() {
    //var doc = SpreadsheetApp.getActiveSpreadsheet();
    var doc = SpreadsheetApp.openById(sheetId);
    SCRIPT_PROP.setProperty("key", doc.getId());
}
