// ===== Google Sheets 后端部署脚本 =====
// 
// 部署步骤：
// 1. 打开 https://sheets.google.com 创建一个新的 Google Sheet
// 2. 在第一行设置表头：
//    A1: 时间戳 | B1: 会话ID | C1: 匹配角色 | D2: 匹配度 | E1: 评价 | F1: 20维分数 | G1: 50题答案
// 3. 点击菜单 扩展 → Apps Script
// 4. 删除原有代码，粘贴下方代码
// 5. 点击 部署 → 新建部署
//    - 类型：Web App
//    - 执行身份：我
//    - 谁可以访问：任何人
//    - 点击 部署
// 6. 复制 Web App URL
// 7. 粘贴到 galti_app.js 中的 DATA_ENDPOINT 变量
//
// ===== 以下是需要粘贴到 Apps Script 的代码 =====

/*
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var answersStr = '';
    if (data.answers) {
      answersStr = data.answers.map(function(a) { return a.o; }).join(',');
    }
    var scoresStr = '';
    if (data.scores) {
      scoresStr = data.scores.join(',');
    }
    
    sheet.appendRow([
      data.ts || new Date().toISOString(),
      data.sid || '',
      data.bestMatch || '',
      data.similarity || '',
      data.rating || '',
      scoresStr,
      answersStr
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', msg: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'GalTI Data Collector v1.0'}))
    .setMimeType(ContentService.MimeType.JSON);
}
*/
+++++++ REPLACE