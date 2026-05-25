const https = require('https');
const fs = require('fs');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function run() {
  await download('https://cdn.tgdd.vn/Products/Images/2386/275376/bhx/sua-tuoi-tiet-trung-vinamilk-100-sua-tuoi-co-duong-hop-1-lit-202311231613098522.jpg', 'public/images/p1.webp');
  await download('https://cdn.tgdd.vn/Products/Images/2386/102927/bhx/sua-tuoi-tiett-rung-khong-duong-tach-beo-vinamilk-100-sua-tuoi-hop-180ml-202308191024354224.jpg', 'public/images/p6.webp');
  await download('https://cdn.tgdd.vn/Products/Images/2386/76269/bhx/sua-tuoi-tiet-trung-vinamilk-100-sua-tuoi-khong-duong-hop-1-lit-202311231612089304.jpg', 'public/images/p9.webp');
  console.log('Downloaded real images');
}

run();
