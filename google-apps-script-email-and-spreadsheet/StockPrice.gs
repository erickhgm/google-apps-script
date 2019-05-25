/**
 * Analyze stock price.
 */
function analyzeStock() {
  var EMAIL = 'youremail@email.com';
  var SHEET_RANGE = 'B3:D19';
  var SHEET_NAME = 'Alerta';
  
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
  var MIN_HOUR = '103000';
  var MAX_HOUR = '183000';
  var MIN_DAY = '1';
  var MAX_DAY = '5';
  
  var now = new Date();
  var currentDate = Utilities.formatDate(now, TIME_ZONE, 'yyyyMMdd');
  var currentHour = Utilities.formatDate(now, TIME_ZONE, 'HHmmss');
  var currentDay = Utilities.formatDate(now, TIME_ZONE, 'u');
  
  var range = 'F' + (parseFloat(i) + 4);
  var lastSendDateCell = sheet.getRange(range);
  
  if(currentDate > lastSendDateCell.getValue() 
    && (currentHour > MIN_HOUR && currentHour < MAX_HOUR)
    && (currentDay >= MIN_DAY && currentDay <= MAX_DAY)) {
      
    lastSendDateCell.setValue(currentDate);
    return true;
  }
  
  return false;
}
