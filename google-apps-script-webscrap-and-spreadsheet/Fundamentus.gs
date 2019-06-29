/**
 * The main function to run. Execute this to extract data.
 */
function main() {
  
  var SHEET_NAME = 'Fundamentus';
  var isFirst = true;
  
  var stocks = getAllStocksOnFundamentus();
  
  var row = 2;
  stocks.forEach(function(stock) {
    
    if (isFirst) {
      var headers = getStocksHeader(stock);
      buildHeader(SHEET_NAME, headers);
      isFirst = false;
    }
    
    var details = getStockDetails(stock);
    buildDetail(SHEET_NAME, stock, details, row);
    
    row++;
  });
}

/**
 * Extract only the stock ticker
 */
function getAllStocksOnFundamentus() {

  var URL = 'http://www.fundamentus.com.br/resultado.php?setor=';
  var REGEX = /<a href="detalhes.php\?papel=([\s\S]*?)<\/a>/gim;
  
  var response = UrlFetchApp.fetch(URL);
  var matchs = response.getContentText('ISO-8859-1').match(REGEX);
  
  var stocks = [];
  matchs.forEach(function(element) {
    var stock = getStockNameInHTML(element);
    stocks.push(stock);
  });
  
  return stocks;
}

/**
 * Extract only the stock ticker from tag '<a>'
 */
function getStockNameInHTML(html) {
  
  var REGEX = /<a href="detalhes.php\?papel=([\s\S]*?)">([\s\S]*?)<\/a>/gim;
  var REPLACE = '$2';
  
  var stock = '';
  try {
    stock = html.replace(REGEX, REPLACE);
  } catch(error) {
    stock = 'ERROR';
  }
  
  return stock.trim();
}

/**
 * Extract column names
 */
function getStocksHeader(stock) {
  
  var REGEX = /<td class="label([\s\S]*?)<\/span><\/td>/gim;
  var URL = 'https://www.fundamentus.com.br/detalhes.php?papel=' + stock;
  
  var response = UrlFetchApp.fetch(URL);
  var matchs = response.getContentText('ISO-8859-1').match(REGEX);
  
  return matchs;  
}

/**
 * Write column names
 */
function buildHeader(SHEET_NAME, headers) {
  
  var columns = ['Papel', 'Tipo', 'Data últ cot', 'Empresa', 'Setor', 'Subsetor', 'Últ balanço processado'];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  var column = 1;
  var row = 1;
  
  headers.forEach(function(element) {
    var header = getHeaderAttributeValue(element);
    
    // Always show 2 decimal points
    if (columns.indexOf(header) == -1) {
      sheet.getRange((row + 1), column, 800).setNumberFormat("#,##0.00");
    }
      
    sheet.getRange(row, column).setValue(header);
    column++;
  });
}

/**
 * Extract text from '<span>' with class 'txt'
 */
function getHeaderAttributeValue(text) {
  
  var REGEX = /.*<span class="txt">([\s\S]*?)<\/span><\/td>/gim;
  var REPLACE = '$1';
  
  var header = '';
  try {
    header = text.replace(REGEX, REPLACE);
  } catch(error) {
    header = 'ERROR';
  }
  
  return header.trim();
}

/**
 * Extract values corresponding to each column
 */
function getStockDetails(stock) {
  
  var REGEX = /<td class="data([\s\S]*?)<\/span><\/td>/gim;
  var URL = 'https://www.fundamentus.com.br/detalhes.php?papel=' + stock;
  
  var response = UrlFetchApp.fetch(URL);
  var details = response.getContentText('ISO-8859-1').match(REGEX);
  
  return details;
}

/**
 * Write values corresponding to each column
 */
function buildDetail(SHEET_NAME, stock, details, row) {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  var column = 1;

  details.forEach(function(element) {
    if (true) {
      var detail = getDetailAttributeValue(element);
      sheet.getRange(row, column).setValue(detail);
      column++;
    }
  });
}

/**
 * Extract text from '<span>' with class 'txt' or 'oscil'
 */
function getDetailAttributeValue(text) {
  
  var REGEX = /.*<span class="(txt|oscil)">(<font color="(.*)">)?([\s\S]*?)(<\/font><\/span><\/td>|<\/span><\/td>)/gim;
  var REPLACE = '$4';
  
  var header = '';
  try {
    header = text.replace(REGEX, REPLACE);
    
    /*
    * Check for string 'resultado.php' to get only the stock ticker
    */
    if (header.indexOf('resultado.php') != -1) {
      REGEX = /<a href="resultado.php([\s\S]*?)>(.*)<\/a>/gim;
      REPLACE = '$2';
      
      header = header.replace(REGEX, REPLACE);
    }
    
  } catch(error) {
    header = 'ERROR';
  }
  
  return formatValues(header.trim());
}

/**
 * Format numeric values
 */
function formatValues(value) {
  
  var REGEX = /(.*),(\d{2}|\d{1})(%$|$)/gim;
  var REPLACE = '$1.$2$3';
  
  if (value.length > 3) {
    value = value.replace('%', '');
    value = value.replace(/\./gim, ',');
    value = value.replace(REGEX, REPLACE);
  }
  
  return value;
}
