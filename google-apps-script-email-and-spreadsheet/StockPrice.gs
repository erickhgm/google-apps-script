/**
 * Analyze stock price.
 */
function analyzeStock() {
  var EMAIL = 'erick.henrique.gm@gmail.com';
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
      } else {
        message = stock + ' - Alert already sent';
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
  var TIME_ZONE = 'America/Sao_Paulo';
  var MIN_HOUR = '100000';
  var MAX_HOUR = '180000';
  
  var now = new Date();
  var currentDate = Utilities.formatDate(now, TIME_ZONE, 'yyyyMMdd');
  var currentHour = Utilities.formatDate(now, TIME_ZONE, 'HHmmss');
  
  var range = 'F' + (row + 4);
  var lastSendDateCell = sheet.getRange(range);
   
  if(currentDate > lastSendDateCell.getValue() 
    && (currentHour > MIN_HOUR && currentHour < MAX_HOUR)) {
    lastSendDateCell.setValue(currentDate);
    return true;
  }
  
  return false;
}
