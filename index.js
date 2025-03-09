const { google } = require('googleapis');
const axios = require('axios');

async function updateSheet() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'path-to-your-service-account-json-file',  // เปลี่ยนเป็นพาธที่คุณเก็บไฟล์ JSON ของ Service Account
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1_g0UxUXGIXXdEeFAQjrD43aP2bOTSkQ_zx7TMAcTY4w'; // ID ของ Spreadsheet
    const range = 'Sheet1!A1'; // ชื่อชีต + เซลล์ที่ต้องการเริ่มอัปเดตข้อมูล

    // ตัวอย่างการดึงข้อมูลจาก Binance API (หรือ API อื่นๆ ที่คุณต้องการ)
    const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
    const data = response.data;

    // เตรียมข้อมูลที่จะอัปเดตใน Google Sheets
    const values = [
        [data.symbol, data.lastPrice, data.priceChangePercent]
    ];

    // อัปเดตข้อมูลใน Google Sheets
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
            values,
        },
    });

    console.log('Data updated successfully!');
}

updateSheet().catch(console.error);
