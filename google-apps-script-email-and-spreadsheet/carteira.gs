/**
 * Sends emails with data from the current spreadsheet.
 */
function sendEmails() {
  var EMAIL = 'your-email@gmail.com';
  var SHEET_RANGE = 'B4:D18';
  var SHEET_NAME = 'sheet-name';
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var dataRange = sheet.getRange(SHEET_RANGE);
  
  var data = dataRange.getValues();
  for (i in data) {
    var row = data[i];
    
    var stock = row[0];
    var currentPrice = row[1];
    var expectedPrice = row[2];
    
    if (currentPrice <= expectedPrice) {
      var subject = stock + ' - Sent by Google Apps Script';
      var message = stock + ' with expected price (' + currentPrice + ' / ' + expectedPrice + ')';
    
      MailApp.sendEmail(EMAIL, subject, message);
      Logger.log(message);
    
    } else {
      var message = stock + ' with price higher than expected (' + currentPrice + ' / ' + expectedPrice + ')';
      Logger.log(message);
    }
    
  }
  
}