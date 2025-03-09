const { google } = require('googleapis');
const axios = require('axios');

// ฟังก์ชันดึงข้อมูลจาก Binance API
async function getBinanceData() {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/bookTicker');
    return response.data;
}

// ฟังก์ชันเพื่อบันทึกข้อมูลลง Google Sheets
async function updateGoogleSheet() {
    const credentials = JSON.parse(process.env.GOOGLE_API_CREDENTIALS); // ใช้ข้อมูลจาก GitHub Secrets
    
    // สร้าง Google Sheets API client
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;  // ใช้ Google Sheets ID จาก GitHub Secrets
    const range = 'Sheet1!A1';  // ระบุตำแหน่งที่ต้องการบันทึกข้อมูล

    const binanceData = await getBinanceData();

    // จัดรูปแบบข้อมูลให้เหมาะสม
    const values = binanceData.map(item => [item.symbol, item.bidPrice, item.askPrice]);

    const resource = {
        values,
    };

    // บันทึกข้อมูลลง Google Sheets
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource,
    });
}

// เรียกใช้งานฟังก์ชัน
updateGoogleSheet().catch(console.error);
