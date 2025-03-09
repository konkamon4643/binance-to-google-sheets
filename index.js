const { google } = require('googleapis');
const axios = require('axios');
const path = require('path');

async function updateSheet() {
    try {
        // ✅ โหลดไฟล์ Service Account JSON
        const auth = new google.auth.GoogleAuth({
            keyFile: path.resolve(__dirname, './binance-api-key.json'), // ตรวจสอบให้แน่ใจว่าไฟล์อยู่ในโฟลเดอร์เดียวกัน
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1_g0UxUXGIXXdEeFAQjrD43aP2bOTSkQ_zx7TMAcTY4w'; // Google Sheets ID
        const range = 'volum!A1'; // กำหนดตำแหน่งที่จะเขียนข้อมูล

        console.log("📡 Fetching Order Book Data from Binance...");

        // ✅ ดึงข้อมูล Order Book จาก Binance API
        const response = await axios.get('https://api.binance.com/api/v3/depth', {
            params: { symbol: 'BTCUSDT', limit: 5 } // ดึง 5 ระดับของ Bids และ Asks
        });

        const data = response.data;

        if (!data || !data.bids || !data.asks) {
            throw new Error("❌ Failed to fetch order book data!");
        }

        // ✅ เตรียมข้อมูล Bids และ Asks สำหรับบันทึกใน Google Sheets
        const values = [
            ["Type", "Price (USDT)", "Quantity (BTC)"], // หัวตาราง
            ...data.bids.map(([price, quantity]) => ["Bid", parseFloat(price), parseFloat(quantity)]),
            ...data.asks.map(([price, quantity]) => ["Ask", parseFloat(price), parseFloat(quantity)])
        ];

        console.log("📊 Writing data to Google Sheets...");

        // ✅ อัปเดตข้อมูลลง Google Sheets
        const result = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: { values },
        });

        if (result.status === 200) {
            console.log("✅ Order Book Data Updated Successfully!");
        } else {
            console.error("⚠️ Google Sheets Update Failed:", result.statusText);
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

// ✅ เรียกใช้งานฟังก์ชัน
updateSheet();
