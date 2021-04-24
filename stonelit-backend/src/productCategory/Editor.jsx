import React, {useState, useEffect} from 'react';
import {Link, useLocation, useRouteMatch, useHistory} from 'react-router-dom';
import {Formik, Form} from 'formik';
import {useToasts} from "react-toast-notifications";
import Forms from "@/_components/Forms";
import * as Yup from 'yup';

import {productParamSetting, productCategory as resource} from '@/_services';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {SubHeadingSource} from "@/_teleporters/Heading";
import queryString from "query-string";

const actionFetch = resource.selectById;
const actionCreate = resource.create;
const actionUpdate = resource.update;

const validationSchema = Yup.object().shape({
    title: Yup.string().required('请输入名称'),
    sort: Yup.number(),
    icon: Yup.string(),
});

const selectProductParam = inputValue => {
    return productParamSetting.selectSelectItems(0).then((data) => {
        const options = [];
        for (let datum of data.data) {
            options.push({
                value: datum.id,
                label: datum.paramName,
            });
        }

        return options;
    });
}

const Editor = ({}) => {
    const history = useHistory();
    const match = useRouteMatch();

    const id = match.params.id;
    const isCreateMode = !id;
    const actionLabel = isCreateMode ? '添加' : '编辑';
    const key = id ?? 'create';

    const location = useLocation();
    const query = queryString.parse(location.search, {
        ignoreQueryPrefix: true
    })
    const pid = query.pid ?? 0;

    // const locationX = useLocation();
    // console.info(location);

    const {addToast} = useToasts();
    const [pending, setPending] = useState(false);
    const [entity, setEntity] = useState({});
    const [productParams, setProductParams] = useState([]);
    const [initialValues, setInitialValues] = useState({
        title: '',
        sort: '',
        icon: '',
    });

    const fetcher = async (id) => {
        const response = await actionFetch(id);
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = response.data[field]);
        setInitialValues(data);

        const productParams = (response.data.paramList ?? []).map((e) => ({label: e.paramName, value: e.id}));
        setProductParams(productParams);

        setEntity(response.data);
        setPending(true);
    };

    useEffect(() => {
        if (isCreateMode) {
            setPending(true);
        } else {
            fetcher(id)
        }
    }, [id]);

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        if (!isCreateMode) {
            data.id = id;
            data.pid = entity.pid;
        } else {
            data.pid = pid;
        }
        if (data.sort === '') {
            data.sort = '0';
        }
        data.paramIdList = productParams.map(e => e.value);

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
        <BreadcrumbLink to={`/${resource.name}`}>{resource.title}</BreadcrumbLink>
        <BreadcrumbLink to={match.path}>{actionLabel}{resource.title}</BreadcrumbLink>
        <SubHeadingSource>{`${actionLabel}${resource.title}`}</SubHeadingSource>

        <div className="card">
            <div className="card-header header-elements-inline">
                <h5 className="card-title">{`${actionLabel}${resource.title}`}</h5>
            </div>

            <div className="card-body">
                <p className="mb-4">请输入或者选择表单项目，项目<span className="text-danger">*</span>为必选项。</p>

                {pending ?
                    <Formik key={key} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {({errors, touched, isSubmitting, setFieldValue}) => {
                            return (
                                <Form>
                                    <fieldset>
                                        <legend className="text-uppercase font-size-sm font-weight-bold">基本资料</legend>

                                        <Forms.Text field="title" label="名称" required={true} />
                                        <Forms.Image field="icon" label="图片" />
                                        <Forms.AsyncSelect field="params" label="产品参数"
                                                              defaultValue={productParams}
                                                              isMulti
                                                              isSearchable={false}
                                                              onChange={e => setProductParams(e)}
                                                              loadOptions={selectProductParam}
                                                              components={{IndicatorSeparator:() => null}}
                                        />
                                        <Forms.Text field="sort" label="排序" remark="数字排序，数字越大越靠前" />
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
};

export const Create = ({history, match}) => (<Editor history={history} match={match} />)
export const Edit = ({history, match}) => (<Editor history={history} match={match} />)

export {Editor};
