/**
 * Analyze stock price.
 */
function analyzeStock() {
  var EMAIL = 'email@gmail.com';
  var SHEET_RANGE = 'B4:D18';
  var SHEET_NAME = 'Alert';
  
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
    
      if(needToSend(sheet, i)) {
        MailApp.sendEmail(EMAIL, subject, message);
        Logger.log(message);
      }
    
    } else {
      var message = stock + ' with price higher than expected (' + currentPrice + ' / ' + expectedPrice + ')';
      Logger.log(message);
    }
    
  }
  
}

/**
 * Valid whether or not email is sent.
 */
function needToSend(sheet, row) {
  var now = new Date();
  var timeZone = 'America/Sao_Paulo';
  var today = Utilities.formatDate(now, timeZone, 'yyyyMMdd');
  
  var range = 'F' + (row + 4);
  var cell = sheet.getRange(range);
   
  if(today > cell.getValue()) {
    cell.setValue(today);
    return true;
  }
    
  return false;
}
