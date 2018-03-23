import Koa from 'koa';
import Router from 'koa-router';
import superagent from 'superagent';
import cheerio from 'cheerio';
const app = new Koa();
const router = new Router();

function sleep(time = 2000) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

async function getDoubanData(url) {
    const page = await superagent.get(url);
    const $ = cheerio.load(page.text);
    let list = [];
    $('ol.grid_view .item').each((index, item) => {
        const $item = $(item);
        const data = {
            title: $item.find('.info .title').text(),
            link: $item.find('.pic a').attr('href'),
            imgUrl: $item.find('.pic img').attr('src'),
            rate: $item.find('.star .rating_num').text()
        };
        list.push(data);
    });
    return list;
}

router.get('/', async (ctx) => {
    const doubanMovies = 'https://movie.douban.com/top250';
    const pageListPomise = [];
    pageListPomise.push(getDoubanData(doubanMovies));
    const listData = await Promise.all(pageListPomise);
    ctx.body = JSON.stringify(listData);
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
