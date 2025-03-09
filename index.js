const { google } = require('googleapis');
const axios = require('axios');

async function updateSheet() {
    const auth = new google.auth.GoogleAuth({
        keyFile: './binance-api-key.json', // เปลี่ยนเป็นพาธของไฟล์ JSON
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1_g0UxUXGIXXdEeFAQjrD43aP2bOTSkQ_zx7TMAcTY4w'; // Google Sheets ID
    const range = 'volum!A1'; // ชื่อชีต + ตำแหน่งเริ่มต้น

    // 🔹 ดึงข้อมูล Order Book ของคู่ BTC/USDT
    const response = await axios.get('https://api.binance.com/api/v3/depth', {
        params: {
            symbol: 'BTCUSDT',
            limit: 5 // ดึง 5 ระดับของ Bids และ Asks
        }
    });

    const data = response.data;

    // 🔹 ดึงข้อมูล bids และ asks
    const bids = data.bids.map(([price, quantity]) => [`Bid`, price, quantity]);
    const asks = data.asks.map(([price, quantity]) => [`Ask`, price, quantity]);

    // 🔹 รวมข้อมูล Bids และ Asks
    const values = [
        ["Type", "Price", "Quantity"], // หัวตาราง
        ...bids,
        ...asks
    ];

    // 🔹 อัปเดตข้อมูลลง Google Sheets
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: { values },
    });

    console.log('✅ Order Book Data Updated!');
}

updateSheet().catch(console.error);
