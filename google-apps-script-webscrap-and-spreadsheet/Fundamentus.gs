function updateByFundamentus() {
  var SHEET_RANGE = 'B3:B19';
  var SHEET_NAME = 'Fundamentos';
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var dataRange = sheet.getRange(SHEET_RANGE);
  
  var data = dataRange.getValues();
  for (i in data) {
    var row = data[i];
    
    var stock = row[0];
    
    var values = scrapFundamentus(stock);
    
    var pl = values[0];
    var cell = 'D' + (3 + parseFloat(i));
    sheet.getRange(cell).setValue(pl);
    
    var pvp = values[1];
    var cell = 'E' + (3 + parseFloat(i));
    sheet.getRange(cell).setValue(pvp);
    
    var roe = values[2];
    cell = 'F' + (3 + parseFloat(i));
    sheet.getRange(cell).setValue(roe);
    
    var dy = values[3];
    var cell = 'G' + (3 + parseFloat(i));
    sheet.getRange(cell).setValue(dy);
    
    var mLiq = values[4];
    cell = 'H' + (3 + parseFloat(i));
    sheet.getRange(cell).setValue(mLiq);
    
  }
  
}

function scrapFundamentus(stock) {

  var URL = 'https://www.fundamentus.com.br/detalhes.php?papel=';
  var REGEX = /<span class="txt">([\s\S]*?)<\/span>/gi;
  var INDEX_PL = 32;
  var INDEX_PVP = 37;
  var INDEX_M_LIQ = 54;
  var INDEX_ROE = 69;
  var INDEX_DY = 67;
  
  var response = UrlFetchApp.fetch(URL + stock);
  var match = response.getContentText().match(REGEX);
  
  var pl = getAttributeValue(match[INDEX_PL].toString());
  var pvp = getAttributeValue(match[INDEX_PVP].toString());
  var roe = getAttributeValue(match[INDEX_ROE].toString());
  var dy = getAttributeValue(match[INDEX_DY].toString());
  var mLiq = getAttributeValue(match[INDEX_M_LIQ].toString());
  
  return new Array(pl, pvp, roe, dy, mLiq);
  
}

function getAttributeValue(text) {
  return text.replace('<span class="txt">', '')
  .replace('</span>', '')
  .replace(',', '.')
  .replace('%', '')
  .trim();
}
