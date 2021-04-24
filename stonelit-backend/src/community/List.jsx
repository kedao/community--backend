import React from 'react';
import { community } from '@/_services';
import {EnhancePaginationTable} from '@/_components';

import {resource, resourceName} from "./";

function List() {
    return (
        <div className="content">
            <div className="card">
                <div className="card-header header-elements-inline">
                    <h5 className="card-title">{resourceName}</h5>
                </div>

                <div className="card-body">
                    <EnhancePaginationTable resource={resource}
                                             fetchUrl={community.selectByPage}
                                             removeUrl={community.remove}
                                             models={[
                        {
                            name: "编号",
                            selector: "id",
                        },
                        {
                            name: "社区",
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