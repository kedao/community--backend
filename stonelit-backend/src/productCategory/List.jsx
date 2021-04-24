import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {productCategory as resource} from '@/_services';
import {EnhancePaginationTable} from '@/_components';
import {ToolbarSource} from "@/_teleporters/Toolbar";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";

function List() {
    const params = useParams();
    const pid = params.pid ?? 0;

    const [category, setCategory] = useState({});
    const [pending, setPending] = useState(true);
    const [breadcrumb, setBreadcrumb] = useState([]);

    useEffect(  () => {
        const fetchData = async (pid) => {
            const breadcrumbs = [];

            const result = await resource.selectById(pid);

            const data = result.data;
            if (data.parent) {
                breadcrumbs.push({
                    id: data.parent.id,
                    name: data.parent.title,
                });
            }

            breadcrumbs.push({
                id: data.id,
                name: data.title,
            });

            setBreadcrumb(breadcrumbs);
            setCategory(data);
            setPending(false);
        };

        if (pid) {
            fetchData(pid);
        } else {
            setPending(false);
            setBreadcrumb([]);
        }
    }, [pid]);

    return (
        <div className="content" key={pid}>
            {!pending && (pid === 0 || category.level != 3) &&
            <ToolbarSource>
                <Link to={`/${resource.name}/create?pid=${pid}`} className="btn btn-link btn-float text-default"><i
                    className="icon-plus-circle2 text-primary"/><span>创建</span></Link>
            </ToolbarSource>}
            <BreadcrumbLink to={`/${resource.name}`}>{resource.title}</BreadcrumbLink>
            {breadcrumb.length > 0 && breadcrumb.map((e) => <BreadcrumbLink key={e.id} to={`/${resource.name}/${e.id}`}>{e.name}</BreadcrumbLink>)}

            <div className="card">
                <div className="card-header header-elements-inline">
                    <h5 className="card-title">{resource.title}</h5>
                </div>

                <div className="card-body">
                    <EnhancePaginationTable resource={resource.name}
                                             fetchUrl={async (page, size) => resource.selectByPage(page, size, '', pid)}
                                             removeUrl={resource.remove}
                                             models={[
                        {
                            name: "编号",
                            selector: "id",
                        },
                        {
                            name: "类目名称",
                            selector: "title",
                        },
                        {
                            name: "类目层级",
                            selector: "level",
                        },
                        {
                            name: "下级类目",
                            cell: (row) => (row.level <= 2 ? <Link to={`/${resource.name}/${row.id}`}>下级类目</Link> : '无')
                        },
                    ]} />
                </div>
            </div>
        </div>
    );
}

export { List };
