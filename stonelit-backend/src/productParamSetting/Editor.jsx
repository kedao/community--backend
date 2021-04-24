import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import {useToasts} from "react-toast-notifications";
import Forms, {CreatableReSelect} from "@/_components/Forms";
import CreatableSelect from 'react-select/creatable';
import * as Yup from 'yup';

import {productParamSetting as resource} from '@/_services';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {SubHeadingSource} from "@/_teleporters/Heading";
import AsyncSelect from "react-select/async/dist/react-select.esm";

const actionFetch = resource.selectById;
const actionCreate = resource.create;
const actionUpdate = resource.update;

const validationSchema = Yup.object().shape({
    paramName: Yup.string()
        .required('请输入参数名称'),
});

const Editor = ({history, match}) => {
    const id = match.params.id;
    const isCreateMode = !id;
    const actionLabel = isCreateMode ? '添加' : '编辑';
    const key = id ?? 'create';

    const {addToast} = useToasts();
    const [pending, setPending] = useState(false);
    const [initialValues, setInitialValues] = useState({
        paramName: '',
        sort: '',
        defaultValue: '',
        enableAll: '0',
        enumValueList: '',
        remark: '',
    })

    const fetcher = async (id) => {
        const response = await actionFetch(id);
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = response.data[field]);
        setInitialValues(data);
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
        console.info(fields);

        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        if (!isCreateMode) {
            data.id = id;
        }
        if (!data.enumValueList) {
            data.enumValueList = null;
        }

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

    const handleChange = (newValue) => {
        console.group('Value Changed');
        console.log(newValue);
        console.groupEnd();
    };

    return <div className="content">
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

                                        <Forms.Text field="paramName" label="参数名称" required />
                                        <Forms.Text field="defaultValue" label="默认值" />
                                        <Forms.CreatableReSelect field="enumValueList" label="枚举值列表"
                                                                    noOptionsMessage="请输入枚举项目" formatCreateLabel="按回车确定" placeholder="请输入枚举项目" />
                                        <Forms.Select field="enableAll" label="应用给所有的产品" options={[{value: '1', label: '是'}, {value: '0', label: '否'}]} />
                                        <Forms.TextArea field="remark" label="参数简介" />
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
