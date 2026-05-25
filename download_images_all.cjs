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
  await download('https://cdn.tgdd.vn/Products/Images/2943/76255/bhx/sua-chua-uong-men-song-vinamilk-probi-co-duong-loc-4-chai-x-130ml-202302061327170887.jpg', 'public/images/p2.webp');
  await download('https://cdn.tgdd.vn/Products/Images/2387/76041/bhx/kem-dac-co-duong-ngoi-sao-phuong-nam-xanh-la-lon-380g-202111171340243160.jpg', 'public/images/p3.webp');
  await download('https://cdn.tgdd.vn/Products/Images/2388/75806/bhx/sua-bot-dielac-alpha-gold-iq-step-4-lon-900g-202111101646274404.jpg', 'public/images/p4.webp');
  await download('https://cdn.tgdd.vn/Products/Images/8953/102941/bhx/loc-4-hop-sua-tuoi-oc-cho-vinamilk-180ml-202302100854497473.jpg', 'public/images/p5.webp');
  await download('https://cdn.tgdd.vn/Products/Images/2944/76116/bhx/pho-mai-vinamilk-hop-120g-8-mieng-202302041353199852.jpg', 'public/images/p7.webp');
  await download('https://cdn.tgdd.vn/Products/Images/2943/76231/bhx/sua-chua-khong-duong-vinamilk-nha-dam-loc-4-hop-x-100g-202302061358055243.jpg', 'public/images/p8.webp');
  console.log('Downloaded ALL real images');
}

run();
