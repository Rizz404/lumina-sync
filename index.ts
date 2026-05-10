import axios from "axios";
import * as fs from "fs";
import * as path from "path";

async function syncData() {
  try {
    // * Mengambil data harga eth dari coingekko
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=idr",
    );
    const price = response.data.ethereum.idr;

    const dataPath = path.join(__dirname, "vault.json");

    // * Baca data lama, buat baru kalo belum ada
    let history: object[] = [];
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      history = JSON.parse(fileContent);
    }

    history.push({
      at: new Date().toISOString(),
      price_idr: price,
    });

    fs.writeFileSync(dataPath, JSON.stringify(history.slice(-10), null, 2));
    console.log("Data ETH berhasil di-sync!");
  } catch (error) {
    console.error("Ada error bang:", error);
  }
}

syncData();
