// ===== Google Sheets 后端部署脚本 =====
// 
// 部署步骤：
// 1. 打开 https://sheets.google.com 创建一个新的 Google Sheet
// 2. 在第一行设置表头：
//    A1: 时间戳 | B1: 会话ID | C1: 匹配角色 | D1: 匹配度 | E1: 评价 | F1: 20维分数 | G1: 50题答案
// 3. 点击菜单 扩展 → Apps Script
// 4. 删除原有代码，粘贴下方注释中的代码
// 5. 把 ADMIN_PASSWORD 改成你自己的密码
// 6. 点击 部署 → 新建部署
//    - 类型：Web App
//    - 执行身份：我
//    - 谁可以访问：任何人
//    - 点击 部署
// 7. 复制 Web App URL
// 8. 粘贴到 galti_app.js 中的 DATA_ENDPOINT 变量
//
// ===== 安全说明 =====
// - 所有人可以通过 POST 写入数据（提交测试结果）
// - 只有你通过密码才能 GET 读取数据
// - Google Sheet 本身只有你的账号能看到
// - 即使别人知道 URL，没有密码也无法读取数据
//
// ===== 读取数据 =====
// 在浏览器打开：你的WebAppURL?action=read&pwd=你的密码
// 会显示所有收集的数据（JSON格式）
//
// ===== 以下是需要粘贴到 Apps Script 的代码 =====

/*
var ADMIN_PASSWORD = 'your_password_here'; // ← 改成你自己的密码！

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
  var action = e.parameter.action;
  var pwd = e.parameter.pwd;
  
  // 只有密码正确才能读取数据
  if (action === 'read' && pwd === ADMIN_PASSWORD) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var result = [];
    for (var i = 1; i < data.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      result.push(row);
    }
    return ContentService.createTextOutput(JSON.stringify(result, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 密码错误或无权限
  return ContentService.createTextOutput(JSON.stringify({
    status: 'denied',
    msg: '访问被拒绝。需要正确的管理员密码。'
  })).setMimeType(ContentService.MimeType.JSON);
}
*/