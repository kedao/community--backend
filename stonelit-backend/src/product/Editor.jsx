import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import {useToasts} from "react-toast-notifications";
import Forms from "@/_components/Forms";
import * as Yup from 'yup';

import {productBrand, productParamSetting, productCategory, productShop, sysDict, product as resource} from '@/_services';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {SubHeadingSource} from "@/_teleporters/Heading";
import AsyncSelectComponent from "react-select/async/dist/react-select.esm";

const actionFetch = resource.selectToUpdate;
const actionCreate = resource.create;
const actionUpdate = resource.update;

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

const validationSchema = Yup.object().shape({
    productName: Yup.string().required('请输入名称'),
    // remark: Yup.string().required('请输入产品简介'),
    categoryOneDTO: Yup.string().required('请选择分类'),
    categoryTwoDTO: Yup.string().required('请选择分类'),
    categoryThreeDTO: Yup.string().required('请选择分类'),
    productBrandDTO: Yup.string().required('请选择品牌'),
    onlineDate: Yup.string().required('请选择上线日期'),
    coverImage: Yup.string().required('请选择封面图片'),
    // supportPlatform: Yup.string(),
    // buyLinkDTOList: Yup.string(),
    // paramValueDTOList: Yup.string().required('请输入或者选择产品参数'),
    // coverImage: Yup.string().required('请上传图片'),
});

const selectProductBrand = inputValue => {
    return productBrand.selectByPage(1, 999999, inputValue).then((data) => {
        const options = [];
        for (let datum of data.data.list) {
            options.push({
                id: datum.id,
                brandName: datum.brandName,
            });

            /*
            options.push({
                value: datum.id,
                label: datum.brandName,
            });
             */
        }

        return options;
    });
}

const selectSupportPlatforms = inputValue => {
    return sysDict.selectById(7).then((response) => {
        const data = response.data;

        const options = [];
        for (let line of data.dictValue.split(',')) {
            if (line) {
                options.push({label: line, value: line});
            }
        }

        return options;
    });
}

const selectProductCategories = pid => inputValue => {
    return productCategory.selectSelectItems(pid).then((data) => {
        const options = [];
        for (let datum of data.data) {
            options.push({
                id: datum.id,
                title: datum.title,
                paramIdList: datum.paramIdList ?? [],
            });
        }

        return options;
    });
}

const Editor = ({history, match}) => {
    const id = match.params.id;
    const isCreateMode = !id;
    const actionLabel = isCreateMode ? '添加' : '编辑';
    const key = id ?? 'create';

    // const locationX = useLocation();
    // console.info(location);

    const {addToast} = useToasts();
    const [pending, setPending] = useState(false);
    const [paramIds, setParamIds] = useState([]);
    const [productShops, setProductShops] = useState([]);
    const [buyLinks, setBuyLinks] = useState({});
    const [params, setParams] = useState([]);
    // const [supportPlatforms, setSupportPlatforms] = useState([]);
    const [initialValues, setInitialValues] = useState({
        productName: '',
        onlineFlag: '0',
        remark: '',
        categoryOneDTO: '',
        categoryTwoDTO: '',
        categoryThreeDTO: '',
        productBrandDTO: '',
        coverImage: '',
        buyLinkDTOList: '',
        paramValueDTOList: '',
        // supportPlatform: '',
        onlineDate: '',
        specification: '',
        supportPlatform: [],
        tagList: [],
        imageList: [],
    })

    useEffect(() => {
        const fetchAllParams = async (paramValues = {}, params = []) => {
            const response = await productParamSetting.selectSelectItems(2);
            const data = response.data;

            data.forEach((e) => {
                try {
                    if (!Array.isArray(e.enumValueList)) {
                        const json = JSON.parse(e.enumValueList);
                        if (Array.isArray(json)) {
                            e.enumValueList = json;
                            return;
                        }

                        e.enumValueList = null;
                    }

                    if (e.enumValueList && e.enumValueList.includes(e.defaultValue)) {
                        e.paramValue = e.defaultValue;
                    }
                } catch (e) {
                }

                if (paramValues[e.id]) {
                    e.paramValue = paramValues[e.id];
                }
            });

            for (let param of params) {
                if (data.filter((e) => e.id === param.id).length === 0) {
                    data.push(param);
                }
            }

            setParams(data);

            return data;
        };

        const fetchProductShop = async () => {
            const response = await productShop.selectSelectItems();
            const data = response.data;

            setProductShops(data);

            return data;
        };

        /*
        const fetchSupportPlatforms = async () => {
            try {
                const response = await sysDict.selectById(7);
                const data = response.data;

                const values = [];
                for (let line of data.dictValue.split(',')) {
                    if (line) {
                        values.push({label: line, value: line});
                    }
                }

                setSupportPlatforms(values);
            } catch (e) {

            }

            return [];
        };
         */

        const fetch = async (id) => {
            let paramIds = [];

            const response = await actionFetch(id);
            const data = response.data;
            const fields = {};

            Object.keys(initialValues).forEach((field, value) => fields[field] = response.data[field] ?? initialValues[field]);

            if (data.categoryOneDTO) {
                const category = data.categoryOneDTO;
                const paramIdList = (category.paramList ?? []).map(e => e.id);
                fields.categoryOneDTO = {id: category.id, title: category.title, paramIdList: paramIdList};

                paramIds = [...paramIds, ...paramIdList];

                if (data.categoryTwoDTO) {
                    const category = data.categoryTwoDTO;
                    const paramIdList = (category.paramList ?? []).map(e => e.id);
                    fields.categoryTwoDTO = {id: category.id, title: category.title, paramIdList: paramIdList};
                    paramIds = [...paramIds, ...paramIdList];

                    if (data.categoryThreeDTO) {
                        const category = data.categoryThreeDTO;
                        const paramIdList = (category.paramList ?? []).map(e => e.id);
                        fields.categoryThreeDTO = {id: category.id, title: category.title, paramIdList: paramIdList};
                        paramIds = [...paramIds, ...paramIdList];
                    }
                }
            }
            if (fields.supportPlatform) {
                fields.supportPlatform = fields.supportPlatform.split(',').filter((e) => e !== '').map((e) => ({value: e, label: e}));
            } else {
                fields.supportPlatform = [];
            }

            setInitialValues(fields);

            const buyLinks = {};
            for (let datum of data.buyLinkDTOList ?? []) {
                buyLinks[datum.id] = {
                    title: datum.title,
                    url: datum.url,
                }
            }

            const params = [];
            const paramValues = {};
            for (let datum of (data.paramValueDTOList ?? [])) {
                paramValues[datum.id] = datum.paramValue;

                if (datum.enableAll === 3) {
                    params.push(datum);
                }
            }

            /*
            for (let datum of params) {
                const [param] = (data.paramValueDTOList ?? []).filter((e) => e.id === datum.id);
                if (param && param.paramValue) {
                    datum.paramValue = param.paramValue;
                }
            }
            */

            await fetchAllParams(paramValues, params);
            await fetchProductShop();
            // await fetchSupportPlatforms();

            setBuyLinks(buyLinks);
            setParamIds([...new Set(paramIds)]);
            setPending(true);
        };

        const setup = async () => {
            await fetchAllParams();
            await fetchProductShop();
            // fetchSupportPlatforms();
            setPending(true);
        }

        if (isCreateMode) {
            setup();
        } else {
            fetch(id);
        }
        
    }, [id]);

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        if (!isCreateMode) {
            data.id = id;
        }
        if (data.sort === '') {
            data.sort = 0;
        }

        const buyLinkDTOList = [];
        const paramValueDTOList = [];

        [...params].filter((e) => e.enableAll === 3 ||  e.enableAll === 1 || paramIds.includes(e.id)).forEach((e) => {
            const datum = {...e};
            if (datum.enableAll === 3) {
                delete datum.id;
            }

            paramValueDTOList.push(datum);
        });

        [...productShops].filter((e) => buyLinks[e.id]).forEach((e) => {
            const datum = {...e};
            datum.title = buyLinks[e.id].title;
            datum.url = buyLinks[e.id].url;

            buyLinkDTOList.push(datum);
        });

        data.buyLinkDTOList = buyLinkDTOList;
        data.paramValueDTOList = paramValueDTOList;

        data.supportPlatform = data.supportPlatform.map(e => e.value).join(',');

        setSubmitting(false);

        setStatus();
        (isCreateMode ? actionCreate(data) : actionUpdate(data)).then(() => {
            addToast(`${actionLabel}${resource.title}完成`, {appearance: 'success'});
            history.push(isCreateMode ? '.' : '..');
        })
        .catch(error => {
            addToast(error ?? `${actionLabel}${resource.title}失败`, {appearance: 'error'});
            setSubmitting(false);
        });
    }

    return <div className="content">
        <BreadcrumbLink to={match.path}>{actionLabel}{resource.title}</BreadcrumbLink>
        <SubHeadingSource>{`${actionLabel}${resource.title}`}</SubHeadingSource>

        <div className="card">
            <div className="card-header header-elements-inline">
                <h5 className="card-title">{`${actionLabel}${resource.title}`}</h5>
            </div>

            <div className="card-body">
                <p className="mb-4">请输入或者选择表单项目，项目<span className="text-danger">*</span>为必选项。</p>

                {pending ? <Formik key={key} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({errors, touched, isSubmitting, setFieldValue, values, setFieldTouched, setFieldError, ...others}) => {
                        const {categoryOneDTO, categoryTwoDTO, categoryThreeDTO} = values;

                        const addParam = () => {
                            const id = (new Date().valueOf()) + s4();
                            setParams([...params, {id: id, enableAll: 3, paramName: '', paramValue: ''}]);
                            setTimeout(() => setFieldTouched('paramValueDTOList', true))
                        }

                        const removeParam = (id) => {
                            setParams(params.filter(e => e.id !== id));
                            setTimeout(() => setFieldTouched('paramValueDTOList', true))
                        }

                        const onParamValueChange = (id, e) => {
                            const value = e.target.value;
                            const data = [...params];

                            for (let i = 0; i < data.length; i++) {
                                if (data[i].id === id) {
                                    data[i].paramValue = value;
                                }
                            }

                            setParams(data);
                            setTimeout(() => setFieldTouched('paramValueDTOList', true))
                        }

                        const onParamNameChange = (id, e) => {
                            const value = e.target.value;
                            const data = [...params];

                            for (let i = 0; i < data.length; i++) {
                                if (data[i].id === id) {
                                    data[i].paramName = value;
                                }
                            }

                            setParams(data);
                            setTimeout(() => setFieldTouched('paramValueDTOList', true))
                        }

                        const validateParams = () => {
                            let checked = true;

                            // console.info([...params].filter((e) => e.enableAll === 3 ||  e.enableAll === 1 || paramIds.includes(e.id)));

                            [...params].filter((e) => e.enableAll === 3 ||  e.enableAll === 1 || paramIds.includes(e.id)).forEach((e) => {
                                if (e.enableAll === 3 && !e.paramName) {
                                    checked = false;
                                }

                                if (!e.paramValue) {
                                    checked = false;
                                }
                            });

                            if (!checked) {
                                return '请填写产品参数';
                            }
                        }

                        const updateBuyLinksError = (data) => {
                            const filtered = Object.values(data).filter((e) => !e.title || !e.url);
                            setFieldValue('buyLinkDTOList', filtered.length > 0 ? '' : '1');
                        }

                        const addBuyLink = (id) => {
                            const data = {...buyLinks};
                            data[id] = {
                                id: id,
                                title: '',
                                url: '',
                            };

                            setBuyLinks(data);
                            // setFieldTouched('buyLinkDTOList', true, true);

                            setTimeout(() => setFieldTouched('buyLinkDTOList', true))
                        }

                        const removeBuyLink = (id) => {
                            const data = {...buyLinks};
                            delete data[id];

                            setBuyLinks(data);
                            // setFieldTouched('buyLinkDTOList', true);

                            setTimeout(() => setFieldTouched('buyLinkDTOList', true))
                        }

                        const onBuyLinkTitleChange = (id, e) => {
                            const value = e.target.value;
                            const data = {...buyLinks};

                            data[id].title = value;

                            setBuyLinks(data);
                            // setFieldTouched('buyLinkDTOList', true);

                            setTimeout(() => setFieldTouched('buyLinkDTOList', true))
                        }

                        const onBuyLinkLinkChange = (id, e) => {
                            const value = e.target.value;
                            const data = {...buyLinks};

                            data[id].url = value;

                            setBuyLinks(data);
                            // setFieldTouched('buyLinkDTOList', true);

                            setTimeout(() => setFieldTouched('buyLinkDTOList', true))
                        }

                        const validateBuyLinks = () => {
                            const filtered = Object.values(buyLinks).filter((e) => !e.title || !e.url);
                            // setFieldValue('buyLinkDTOList', filtered.length > 0 ? '' : '1');

                            if (filtered.length > 0) {
                                return '请输入链接';
                            }
                        }

                        return (
                            <Form>
                                <fieldset>
                                    <legend className="text-uppercase font-size-sm font-weight-bold">基本资料</legend>

                                    <Forms.Text field="productName" label="产品名称" required={true} />

                                    <div className="form-group row">
                                        <label className="col-lg-2 col-form-label font-weight-semibold">产品分类 <span className="text-danger">*</span></label>
                                        <div className="col-lg-10">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <AsyncSelectComponent
                                                        placeholder=""
                                                        defaultOptions={true}
                                                        loadingMessage={() => '搜索中'}
                                                        noOptionsMessage={() => '没有匹配结果'}
                                                        isSearchable={false}
                                                        onChange={e => {
                                                            if (e.id === categoryOneDTO?.id) {
                                                                return;
                                                            }

                                                            setFieldValue('categoryOneDTO', e);
                                                            setFieldValue('categoryTwoDTO', '');
                                                            setFieldValue('categoryThreeDTO', '');
                                                            setParamIds([...e.paramIdList]);
                                                        }}
                                                        isInvalid={errors.categoryOneDTO && touched.categoryOneDTO}
                                                        styles={
                                                            {
                                                                control: base => ({
                                                                    ...base,
                                                                    boxShadow: 'none',
                                                                    borderColor: errors.categoryOneDTO && touched.categoryOneDTO ? 'red' : '#ddd'
                                                                })
                                                            }
                                                        }
                                                        defaultValue={categoryOneDTO}
                                                        getOptionLabel={option => option.title}
                                                        getOptionValue={option => option.id}
                                                        loadOptions={selectProductCategories(0)}
                                                        components={{IndicatorSeparator:() => null}}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <AsyncSelectComponent
                                                        key={categoryOneDTO?.id}
                                                        placeholder=""
                                                        defaultOptions={true}
                                                        isSearchable={false}
                                                        loadingMessage={() => '搜索中'}
                                                        noOptionsMessage={() => '没有匹配结果'}
                                                        onChange={e => {
                                                            if (e.id === categoryTwoDTO?.id) {
                                                                return;
                                                            }

                                                            setFieldValue('categoryTwoDTO', e);
                                                            setFieldValue('categoryThreeDTO', '');
                                                            setParamIds([...categoryOneDTO.paramIdList, ...e.paramIdList]);
                                                        }}
                                                        isInvalid={categoryOneDTO?.id && errors.categoryTwoDTO && touched.categoryTwoDTO}
                                                        isDisabled={!categoryOneDTO?.id}
                                                        styles={
                                                            {
                                                                control: base => ({
                                                                    ...base,
                                                                    boxShadow: 'none',
                                                                    borderColor: categoryOneDTO?.id && errors.categoryTwoDTO && touched.categoryTwoDTO ? 'red' : '#ddd'
                                                                })
                                                            }
                                                        }
                                                        defaultValue={categoryTwoDTO}
                                                        getOptionLabel={option => option.title}
                                                        getOptionValue={option => option.id}
                                                        loadOptions={categoryOneDTO?.id ? selectProductCategories(categoryOneDTO?.id) : null}
                                                        components={{IndicatorSeparator:() => null}}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <AsyncSelectComponent
                                                        key={categoryTwoDTO?.id}
                                                        placeholder=""
                                                        defaultOptions={true}
                                                        isSearchable={false}
                                                        loadingMessage={() => '搜索中'}
                                                        noOptionsMessage={() => '没有匹配结果'}
                                                        onChange={e => {
                                                            if (e.id === categoryThreeDTO?.id) {
                                                                return;
                                                            }

                                                            setFieldValue('categoryThreeDTO', e);
                                                            setParamIds([...categoryOneDTO.paramIdList, ...categoryTwoDTO.paramIdList, ...e.paramIdList]);
                                                        }}
                                                        isInvalid={categoryTwoDTO?.id && errors.categoryThreeDTO && touched.categoryThreeDTO}
                                                        isDisabled={!categoryTwoDTO?.id}
                                                        styles={
                                                            {
                                                                control: base => ({
                                                                    ...base,
                                                                    boxShadow: 'none',
                                                                    borderColor: categoryTwoDTO?.id && errors.categoryThreeDTO && touched.categoryThreeDTO ? 'red' : '#ddd'
                                                                })
                                                            }
                                                        }
                                                        defaultValue={categoryThreeDTO}
                                                        getOptionLabel={option => option.title}
                                                        getOptionValue={option => option.id}
                                                        loadOptions={categoryTwoDTO?.id ? selectProductCategories(categoryTwoDTO?.id) : null}
                                                        components={{IndicatorSeparator:() => null}}
                                                    />
                                                </div>
                                            </div>

                                            {(errors.categoryOneDTO && touched.categoryOneDTO &&
                                                <div className="invalid-feedback invalid-feedback-display">{errors.categoryOneDTO}</div>) ||
                                            (errors.categoryTwoDTO && touched.categoryTwoDTO &&
                                                <div className="invalid-feedback invalid-feedback-display">{errors.categoryTwoDTO}</div>) ||
                                            (errors.categoryThreeDTO && touched.categoryThreeDTO &&
                                                <div className="invalid-feedback invalid-feedback-display">{errors.categoryThreeDTO}</div>)}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-lg-2 col-form-label font-weight-semibold">产品参数 <span className="text-danger">*</span></label>

                                        <div className="col-lg-10">
                                            {[...params].filter((e) => e.enableAll === 3 ||  e.enableAll === 1 || paramIds.includes(e.id)).map((e) => <div key={e.id} className="row form-group">
                                                {e.enableAll !== 3 ?
                                                <div className="col-lg-4"><input type="text" readOnly className="form-control" defaultValue={e.paramName} /></div>:
                                                <div className="col-lg-4"><input type="text" className="form-control" placeholder="请输入参数名" defaultValue={e.paramName} onChange={(ee) => onParamNameChange(e.id, ee)} /></div>}

                                                <div className="col-lg-8">
                                                    {e.enableAll === 3 ?
                                                    <div className="input-group">
                                                        <input type="text" className="form-control"
                                                               placeholder="请输入参数值" defaultValue={e.paramValue ?? e.defaultValue} onChange={(ee) => onParamValueChange(e.id, ee)} />
                                                            <span className="input-group-append">
                                                                <button className="btn btn-light btn-icon" type="button" onClick={() => removeParam(e.id)}><i className="icon-trash"/></button>
                                                            </span>
                                                    </div> :
                                                        <div className="input-group">
                                                            {e.enumValueList && e.enumValueList.length ?
                                                            <select className="form-control" defaultValue={e.paramValue ?? e.defaultValue} onChange={(ee) => onParamValueChange(e.id, ee)}>
                                                                <option value=""/>
                                                                {e.enumValueList.map((e) => <option key={e} value={e}>{e}</option>)}
                                                            </select> :
                                                            <input type="text" className="form-control" defaultValue={e.paramValue ?? e.defaultValue} onChange={(ee) => onParamValueChange(e.id, ee)} placeholder="请输入参数值" />}
                                                        </div>}
                                                    </div>
                                            </div>)}

                                            <Field name="paramValueDTOList" type="hidden" validate={validateParams} />
                                            <ErrorMessage name="paramValueDTOList" component="div"
                                                          className="invalid-feedback invalid-feedback-display"/>

                                            <div className="text-center">
                                                <button type="button" className="btn btn-light" onClick={addParam}>添加参数</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-lg-2 col-form-label font-weight-semibold">购买链接</label>

                                        <div className="col-lg-10">
                                            {productShops.map((e) => <div key={e.id} className="row form-group">
                                                <div className="col-lg-2"><input type="text" readOnly className="form-control" defaultValue={e.shopName} /></div>
                                                <div className="col-lg-10">
                                                    {buyLinks[e.id] ?
                                                    <div className="input-group">
                                                        <input type="text" className="form-control"
                                                               placeholder="标题" defaultValue={buyLinks[e.id].title} onChange={(ee) => onBuyLinkTitleChange(e.id, ee)} />
                                                        <span className="input-group-append">
                                                            <span className="input-group-text"><i className="icon-link"/></span>
                                                        </span>
                                                        <input type="text" className="form-control" defaultValue={buyLinks[e.id].url}
                                                               placeholder="链接" onChange={(ee) => onBuyLinkLinkChange(e.id, ee)} style={{borderLeft: 'none', borderRight: 'none'}} />
                                                        <button className="btn btn-light btn-icon" type="button" onClick={() => removeBuyLink(e.id)}><i className="icon-trash"/></button>
                                                    </div> : <button type="button" className="btn btn-light" onClick={() => addBuyLink(e.id)}>添加链接</button>}
                                                </div>
                                            </div>)}

                                            <Field name="buyLinkDTOList" type="hidden" validate={validateBuyLinks} />
                                            <ErrorMessage name="buyLinkDTOList" component="div"
                                                          className="invalid-feedback invalid-feedback-display"/>
                                        </div>
                                    </div>

                                    <Forms.AsyncSelect field="productBrandDTO" label="品牌" required={true}
                                                       loadOptions={selectProductBrand}
                                                       components={{IndicatorSeparator:() => null}}
                                                       onChange={e => setFieldValue('productBrandDTO', e)}
                                                       getOptionLabel={option => option.brandName}
                                                       getOptionValue={option => option.id}
                                    />

                                    <Forms.TextArea field="remark" label="产品简介" required={true} />
                                    <Forms.Image field="coverImage" label="封面图片" required={true} />
                                    <Forms.Images field="imageList" label="图片" required={true} />
                                    <Forms.DateTimePicker field="onlineDate" label="上线日期" required={true} />
                                    <Forms.Select field="onlineFlag" label="上线状态" options={[{value: '0', label: '隐藏'}, {value: '1', label: '显示'}]} />
                                    <Forms.CreatableReSelect field="tagList" label="标签"
                                                                noOptionsMessage="请输入标签" formatCreateLabel="按回车确定" placeholder="请输入标签" />
                                    <Forms.Text field="specification" label="规格型号" />
                                    <Forms.AsyncSelect field="supportPlatform" label="支持的平台"
                                                       isMulti
                                                       loadOptions={selectSupportPlatforms}
                                                       components={{IndicatorSeparator:() => null}}
                                                       onChange={e => setFieldValue('supportPlatform', e)}
                                                       getOptionLabel={option => option.label}
                                                       getOptionValue={option => option.value}
                                    />
                                </fieldset>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting &&
                                        <i className="icon-spinner2 spinner mr-1" />}
                                        保存</button>
                                    <Link to={isCreateMode ? '.' : '..'} className="btn btn-light ml-1">取消</Link>
                                </div>
                            </Form>
                        );
                    }}
                </Formik> : null}
            </div>
        </div>
    </div>;
}

export const Create = ({history, match}) => (<Editor history={history} match={match} />)
export const Edit = ({history, match}) => (<Editor history={history} match={match} />)

export {Editor};
