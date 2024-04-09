const puppeteer = require('puppeteer');
const fs = require('fs');

const parfumArray = [];

const scrapper = async (url) => {
  console.log(url);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);
  await page.setViewport({ width: 1080, height: 1080 });

  repeat(page);
};

const repeat = async (page) => {
  const arrayDivs = await page.$$('.product-item-info');

  for (const product of arrayDivs) {
    let price = await product.$eval('.price', (el) =>
      el.textContent.replace('€', '')
    );

    let title = await product.$eval('.product-brand', (el) => el.textContent);
    let img = await product.$eval('img', (el) => el.src);

    const parfum = {
      title,
      price,
      img,
    };

    parfumArray.push(parfum);
  }

  try {
    await page.$eval("[title='Continuar']", (el) => el.click());
    await page.waitForNavigation();
    console.log('PASAMOS A LA SIGUIENTE PÁGINA');
    console.log(`llevamos ${parfumArray.length} datos recolectados`);
    repeat(page);
  } catch (error) {
    write(parfumArray);
  }

  //   write(parfumArray);
};

const write = (parfumArray) => {
  fs.writeFile('parfum.json', JSON.stringify(parfumArray), () => {
    console.log('archivo escrito');
  });
};

scrapper('https://www.druni.es/perfumes/mujer');
