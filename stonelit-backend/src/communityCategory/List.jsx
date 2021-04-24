import React from 'react';
import { communityCategory } from '@/_services';
import {EnhancePaginationTable} from '@/_components';
import {resourceName} from "./";

function List() {
    return (
        <div className="content">
            <div className="card">
                <div className="card-header header-elements-inline">
                    <h5 className="card-title">{resourceName}</h5>
                </div>

                <div className="card-body">
                    <EnhancePaginationTable resource="communityCategory"
                                             fetchUrl={communityCategory.selectByPage}
                                             removeUrl={communityCategory.remove}
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