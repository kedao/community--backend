import React, {useState} from 'react';
import {product as resource, productCategory} from '@/_services';
import {EnhancePaginationTable} from '@/_components';
import _ from 'lodash'
import Switch from 'react-switch';
import CreatableSelect from "react-select/creatable";
import AsyncSelectComponent from "react-select/async/dist/react-select.esm";

const ONLINE_STATUS = resource.ONLINE_STATUS;
const OFFLINE_STATUS = resource.OFFLINE_STATUS;

const selectProductCategories = pid => inputValue => {
    return productCategory.selectSelectItems(pid).then((data) => {
        const options = [];
        for (let datum of data.data) {
            options.push({
                id: datum.id,
                title: datum.title,
            });
        }

        return options;
    });
}

function List() {
    const [data, setData] = useState([]);
    const [categoryOne, setCategoryOne] = useState({});
    const [categoryTwo, setCategoryTwo] = useState({});
    const [categoryThree, setCategoryThree] = useState({});
    const [filters, setFilters] = useState({
        id: '',
        productName: '',
        labels: '',
        categoryOneId: null,
        categoryTwoId: null,
        categoryThreeId: null,
    });
    const [refresh, setRefresh] = useState(false);

    const ActionSwitchComponent = ({ row, onChange, children }) => {
        const changeHandler = () => onChange(row);

        return <Switch onClick={changeHandler}
            className="react-switch"
            onChange={changeHandler}
            checked={row.onlineFlag === ONLINE_STATUS}
            height={22}
            handleDiameter={20}
            width={42}
        >{children}</Switch>;
    };

    const handleAction = (row) => {
        const rows = _.cloneDeep(data);

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].id !== row.id) {
                continue;
            }

            if (rows[i].onlineFlag !== ONLINE_STATUS) {
                rows[i].onlineFlag = ONLINE_STATUS;
                resource.hide(rows[i].id).then();
            } else {
                rows[i].onlineFlag = OFFLINE_STATUS;
                resource.restore(rows[i].id).then();
            }
        }

        setData(rows);
    }

    const handleRefreshWhenKeyEnterUp = (key, e) => {
        if (e.keyCode === 13) {
            setFilter(key, e.target.value)
        }
    }

    const setFilter = (key, value) => {
        setFilters({
            ...filters,
            [key]: value,
        });
    }

    const subActions = [<div key="row1" className="row" style={{width: '100%', margin: "0 0 .625rem 0"}}>
        <div className="col-lg-2">
            <input className="form-control" placeholder="产品ID" onBlur={(e) => setFilter('id', e.target.value)} onKeyUp={(e) => handleRefreshWhenKeyEnterUp('id', e)} />
        </div>
        <div className="col-lg-3">
            <input className="form-control" placeholder="产品名称" onBlur={(e) => setFilter('productName', e.target.value)} onKeyUp={(e) => handleRefreshWhenKeyEnterUp('productName', e)} />
        </div>
        <div className="col-lg-5">
            <CreatableSelect
                classNamePrefix="react-select"
                className="general"
                style={{maxWidth: '300px', width: '100px', fontSize: '12px'}}
                isMulti
                onChange={(e) => setFilter('tagList', e.map(e => e.label))}
                noOptionsMessage={() => "请输入标签"}
                formatCreateLabel={() => "按回车确定"}
                placeholder="请输入标签" />
        </div>
        <div className="col-lg-2">
            <select
                className="form-control"
                onChange={(e) => setFilter('onlineFlag', e.target.value)}>
                <option value="">产品状态</option>
                <option value={ONLINE_STATUS}>正常</option>
                <option value={OFFLINE_STATUS}>隐藏</option>
            </select>
        </div>
    </div>,
        <div key="row2" className="row" style={{width: '100%', margin: "0 0 .625rem 0"}}>
        <div className="col-lg-3">
            <AsyncSelectComponent
                placeholder="一级分类"
                defaultOptions={true}
                loadingMessage={() => '搜索中'}
                noOptionsMessage={() => '没有匹配结果'}
                isSearchable={false}
                onChange={e => {
                    if (e.id === categoryOne?.id) {
                        return;
                    }

                    setCategoryOne(e);
                    setCategoryTwo('');
                    setCategoryThree('');

                    setFilters({
                        ...filters,
                        categoryOneId: e.id,
                        categoryTwoId: null,
                        categoryThreeId: null,
                    });
                }}
                /* defaultValue={categoryOne} */
                getOptionLabel={option => option.title}
                getOptionValue={option => option.id}
                loadOptions={selectProductCategories(0)}
                components={{IndicatorSeparator:() => null}}
            />
        </div>

        <div className="col-lg-3">
            <AsyncSelectComponent
                key={categoryOne?.id}
                placeholder="二级分类"
                defaultOptions={true}
                isSearchable={false}
                loadingMessage={() => '搜索中'}
                noOptionsMessage={() => '没有匹配结果'}
                onChange={e => {
                    if (e.id === categoryTwo?.id) {
                        return;
                    }

                    setCategoryTwo(e);
                    setCategoryThree('');

                    setFilters({
                        ...filters,
                        categoryTwoId: e.id,
                        categoryThreeId: null,
                    });
                }}
                /* defaultValue={categoryTwo} */
                getOptionLabel={option => option.title}
                getOptionValue={option => option.id}
                loadOptions={categoryOne?.id ? selectProductCategories(categoryOne?.id) : null}
                components={{IndicatorSeparator:() => null}}
            />
        </div>

        <div className="col-lg-3">
            <AsyncSelectComponent
                key={categoryTwo?.id}
                placeholder="三级分类"
                defaultOptions={true}
                isSearchable={false}
                loadingMessage={() => '搜索中'}
                noOptionsMessage={() => '没有匹配结果'}
                onChange={e => {
                    if (e.id === categoryThree?.id) {
                        return;
                    }

                    setFilters({
                        ...filters,
                        categoryThreeId: e.id,
                    });
                }}
                /* defaultValue={categoryThree} */
                getOptionLabel={option => option.title}
                getOptionValue={option => option.id}
                loadOptions={categoryTwo?.id ? selectProductCategories(categoryTwo?.id) : null}
                components={{IndicatorSeparator:() => null}}
            />
        </div>

        <div className="col-lg-2">
            <button type="button" className="btn btn-light btn-icon" onClick={() => setRefresh(!!refresh)}>查找</button>
        </div>
    </div>];

    const customStyles = {
        subHeader: {
            style: {
                width: '100%',
                padding: '4px 4px 4px 4px',
            },
        }
    }

    return (
        <div className="content">
            <div className="card">
                <div className="card-body card-header-less">
                    <EnhancePaginationTable resource={resource.name}
                                           title={resource.title}
                                           data={data}
                                           setData={setData}
                                           fetchUrl={resource.selectByPage}
                                           removeUrl={resource.remove}
                                           /* actions={actions} */
                                           subActions={subActions}
                                           customStyles={customStyles}
                                           filters={filters}
                                           refresh={refresh}
                                           models={[
                        {
                            name: "产品ID",
                            selector: "id",
                            width: "70px"
                        },
                        {
                            name: "产品名称",
                            selector: "productName",
                            width: "200px"
                        },
                         {
                             name: "产品标签",
                             cell: (row) => {
                                 let tags = [];

                                 try {
                                     if (typeof row.tag === 'string' || row.tag instanceof String) {
                                         try {
                                             tags = JSON.parse(row.tag);
                                             if (!Array.isArray(tags)) {
                                                 tags = [];
                                             }
                                         } catch (e) {
                                             console.error(e);
                                         }
                                     }
                                 } catch (e) {
                                     console.error(e)
                                 }

                                 if (Array.isArray(row.tag)) {
                                     tags = row.tag;
                                 }

                                 return tags.join('、')
                             }
                         },
                         {
                             name: "上线状态",
                             cell: (row) =>
                                 <ActionSwitchComponent row={row} onChange={handleAction}  />
                             ,
                             ignoreRowClick: true,
                             width: "80px"
                             // button: true,
                         },
                        {
                            name: "1级类目",
                            selector: "categoryOneName",
                            width: "90px"
                        },
                        {
                            name: "2级类目",
                            selector: "categoryTwoName",
                            width: "90px"
                        },
                        {
                            name: "3级类目",
                            selector: "categoryThreeName",
                            width: "90px"
                        },
                        {
                            name: "创建时间",
                            selector: "createdTime",
                        },
                    ]}
                    />
                </div>
            </div>
        </div>
    );
}

export { List };
