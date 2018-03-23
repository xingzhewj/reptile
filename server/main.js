const Koa = require('koa');
const superagent = require('superagent');
const cheerio = require('cheerio');
const app = new Koa();

function getDoubanData($dom, list) {
    $dom('ol.grid_view .item').each((index, item) => {
        const $item = $dom(item);
        const data = {
            title: $item.find('.info .title').text(),
            link: $item.find('.pic a').attr('href'),
            imgUrl: $item.find('.pic img').attr('src'),
            rate: $item.find('.star .rating_num').text()
        };
        list.push(data);
    });
}

app.use(async (ctx) => {
    const doubanMovies = 'https://movie.douban.com/top250';
    const page = await superagent.get(doubanMovies);
    const $ = cheerio.load(page.text);
    const list = [];
    getDoubanData($, list);
    // $('.paginator a').each((index, item) => {
    //     const $item = $(item);
    //     const pageHref = $item.attr('href');
    //     const pageNext = await superagent.get(pageHref);
    //     const $Page = cheerio.load(page.text);
    //     getDoubanData($Page, list);
    // });
    ctx.body = JSON.stringify(list);
});

app.listen(3000);
