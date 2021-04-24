import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/index`;

function selectIndexArticleChannel() {
    return fetchWrapper.get(`${baseUrl}/selectIndexArticleChannel`);
}

function selectArticleCardByPage(channelId, pageNum, pageSize) {
    return fetchWrapper.get(`${baseUrl}/selectArticleCardByPage`, {
        channelId,
        pageNum,
        pageSize
    });
}

const name = 'home';
const title = '首页';

export const Home = {
    name,
    title,
    selectIndexArticleChannel,
    selectArticleCardByPage,
};
