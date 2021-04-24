import React from 'react';
import { articleChannel } from '@/_services';
import {EnhancePaginationTable} from '@/_components';

function List() {
    return (
        <div className="content">
            <div className="card">
                <div className="card-header header-elements-inline">
                    <h5 className="card-title">频道管理</h5>
                </div>

                <div className="card-body">
                    <EnhancePaginationTable resource="articleChannel"
                                           fetchUrl={articleChannel.selectByPage}
                                           removeUrl={articleChannel.remove}
                                           models={[
                        {
                            name: "编号",
                            selector: "id",
                        },
                        {
                            name: "频道",
                            selector: "title",
                        },
                        {
                            name: "排序",
                            selector: "sort",
                        }
                    ]} />
                </div>
            </div>
        </div>
    );
}

export { List };