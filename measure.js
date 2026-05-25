import { Jimp } from 'jimp';

const urls = [
  "https://d8um25gjecm9v.cloudfront.net/cms/SCA_GF_ID_01_3f2afca818_286c5123ee.png", // 16 static
  "https://d8um25gjecm9v.cloudfront.net/cms/SP_19_Side_665c54b37b_ff6e9dfb31_ff6b65812f.webp", // 16 hover
  "https://d8um25gjecm9v.cloudfront.net/cms/SCUTT_GF_thanhtrung_ID_01_a64a385623_923869557f.png", // 10 static
  "https://d8um25gjecm9v.cloudfront.net/cms/SP_23_Side_982d2c1cb5_361f5e8948_cd5bc8a551.webp", // 10 hover
  "https://d8um25gjecm9v.cloudfront.net/cms/STV_9_loai_hat_ID_1_Lvuong_01_61c68ca928_f405e33f93.png", // 18 static
  "https://d8um25gjecm9v.cloudfront.net/cms/SP_13_Side_35aab76c3e_4a3e6ea55a_2fa9ea8e3f.webp", // 18 hover
  "https://d8um25gjecm9v.cloudfront.net/cms/GF_CD_180ml_01_e23b453767.png", // 17 static
  "https://d8um25gjecm9v.cloudfront.net/cms/SP_1_Side_4846bd0415_65223fdbc1_22e6c00bbb.webp" // 17 hover
];

async function measure() {
  for (let i = 0; i < urls.length; i++) {
    try {
      const image = await Jimp.read(urls[i]);
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      let bottomPadding = 0;
      
      // Scan from bottom to top
      for (let y = height - 1; y >= 0; y--) {
        let hasVisiblePixel = false;
        for (let x = 0; x < width; x++) {
          const color = image.getPixelColor(x, y);
          const rgba = Jimp.intToRGBA(color);
          // Only check non-transparent pixels (a > 150 ignores shadows)
          if (rgba.a > 150) {
            hasVisiblePixel = true;
            break;
          }
        }
        if (hasVisiblePixel) {
          bottomPadding = height - 1 - y;
          break;
        }
      }
      const percentage = (bottomPadding / height) * 100;
      console.log(`Image ${i} padding: ${bottomPadding}px, height: ${height}px -> offset: translate-y-[${percentage.toFixed(2)}%]`);
    } catch (e) {
      console.error(`Error reading ${urls[i]}:`, e.message);
    }
  }
}

measure();
