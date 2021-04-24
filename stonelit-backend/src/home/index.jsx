import React, {useEffect, useState} from 'react';
import {HeadingSource} from "@/_teleporters/Heading";
import {SubHeadingSource} from "@/_teleporters/Heading";
import {accountService, dashboardService as resource} from "@/_services";

import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from '@devexpress/dx-react-chart-bootstrap4';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import { Animation } from '@devexpress/dx-react-chart';
import {permissions} from "@/_helpers";

const countItems = {
    countTodayArticle: '当日文章投稿',
    countTodayArticleComment: '当日文章评论',
    countTodayPost: '当日发帖',
    countTodayPostReply: '当日帖子回复',
    countTodayProductComment: '当日产品评价',
    countTodayProductCommentReply: '当日评价评论',
    countTodayVideo: '当日视频投稿',
    countTodayVideoComment: '当日视频评论',
    currentOnlineCount: '获取当前在线人数',
    todayOnlineCount: '日活',
};

function Today() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const response = await resource.onlineUserPerHour();

            const data = [];

            for (let datum of response.data) {
                const parsed = / ([0-9]{2})/.exec(datum.createdTime);
                const hour = parsed[1];

                data.push(
                    {
                        label: hour,
                        value: datum.onlineCount,
                    }
                );
            }
            setData(data);
        };

        fetch();
    }, []);

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="card">
            <Chart
                key={data}
                data={data}
            >
                <ArgumentAxis/>
                <ValueAxis max={7}/>

                <BarSeries
                    valueField="value"
                    argumentField="label"
                />
                <Title text="每小时的在线人数"/>
                <Animation/>
            </Chart>
        </div>
    );
}

function OnlineUserPerHour() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = [];

            for (let [method, label] of Object.entries(countItems)) {
                let value = 0;

                try {
                    const response = await resource[method]();
                    value = response.data;
                } catch (e) {
                }

                data.push(
                    {
                        label: label,
                        value: value,
                    }
                );
            }
            setData(data);
        };

        fetch();
    }, []);

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="card">
            <Chart
                key={data}
                data={data}
            >
                <ArgumentAxis/>
                <ValueAxis max={7}/>

                <BarSeries
                    valueField="value"
                    argumentField="label"
                />
                <Title text="今日数据"/>
                <Animation/>
            </Chart>
        </div>
    );
}

function Home() {
    const hasRight = accountService.checkRight(permissions.dashboard);
    if (hasRight) {
        return (
            <div className="content">
                <HeadingSource>管理后台</HeadingSource>
                <SubHeadingSource>看板</SubHeadingSource>

                <Today />
                <OnlineUserPerHour />
            </div>
        );
    } else {
        return (
            <div className="content">
                <HeadingSource>管理后台</HeadingSource>
                <SubHeadingSource>后台首页</SubHeadingSource>
            </div>
        );
    }
}

export { Home };
