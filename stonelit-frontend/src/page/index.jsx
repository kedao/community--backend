import React, {useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {Layout} from "@/_components";
import {statisticPage as statisticPageService} from "@/_services";
import AvatarIcon from "@/_assets/images/user.svg";
import classNames from "classnames";
import {dateSimple} from "@/_helpers/utils";
import ReactPlayer from "react-player";
import ArticleComment from "@/article/comment";

function App() {
    const match = useRouteMatch();
    const id = match.params.id;

    const [data, setData] = useState(null);

    useEffect(() => {
        document.body.className = 'blank';
        return () => { document.body.className = ''; }
    });

    useEffect(() => {
        const fetch = async (id) => {
            const response = await statisticPageService.selectById(id);
            const data = response.data;

            setData(data);

            return data;
        };

        if (id) {
            fetch(id);
        }
    }, [id]);

    return (
        <Layout>
            {/*}
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="u-mv-large u-text-center">
                            <h2 className="u-mb-xsmall">{data?.title}</h2>
                        </div>
                    </div>
                </div>
            </div>
            */}

            <div className="container home-container u-mb-medium u-mb-medium">
                <div className="row u-mb-large">
                    <div className="col-md-12">
                        <div className="u-mt-medium u-mb-medium u-text-center">
                            <h2 className="post-title">
                                {data?.categoryName}
                            </h2>
                        </div>

                        <div className=" u-mt-small u-mb-medium u-mb-medium content-container border-less">
                            <div dangerouslySetInnerHTML={{__html: data?.contents}} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export { App };

export default App;
