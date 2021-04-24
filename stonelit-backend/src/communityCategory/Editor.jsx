import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import {useToasts} from "react-toast-notifications";
import * as Yup from 'yup';
import {communityCategory} from '@/_services';
import { BreadcrumbLink } from "@/_teleporters/Breadcrumb";
import { SubHeadingSource } from "@/_teleporters/Heading";
import {resourceName} from "./";
import Forms from "@/_components/Forms";

const actionFetch = communityCategory.selectById;
const actionCreate = communityCategory.create;
const actionUpdate = communityCategory.update;

const validationSchema = Yup.object().shape({
    title: Yup.string().required('请输入名称'),
    coverImage: Yup.string().required('请上传图片'),
    sort: Yup.number(),
});

const Editor = ({history, match}) => {
    const id = match.params.id;
    const isCreateMode = !id;
    const actionLabel = isCreateMode ? '添加' : '编辑';
    const key = id ?? 'create';

    const {addToast} = useToasts();
    const [pending, setPending] = useState(true);
    const [initialValues, setInitialValues] = useState({
        title: '',
        sort: '',
        coverImage: '',
    })

    const fetcher = async (id) => {
        const response = await actionFetch(id);
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = response.data[field]);
        console.info(data);
        setInitialValues(data);
        setPending(false);
    };

    useEffect(() => {
        if (isCreateMode) {
            setPending(false);
        } else {
            fetcher(id)
        }
    }, [id]);

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        if (data.sort === '') {
            data.sort = '0';
        }
        if (!isCreateMode) {
            data.id = id;
        }

        setStatus();
        (isCreateMode ? actionCreate(data) : actionUpdate(data)).then(() => {
            addToast(`${actionLabel}${resourceName}完成`, {appearance: 'success'});
            history.push(isCreateMode ? '.' : '..');
        })
        .catch(error => {
            addToast(error ?? `${actionLabel}${resourceName}失败`, {appearance: 'error'});
            setSubmitting(false);
        });
    }

    return <div className="content">
        <BreadcrumbLink to={match.path}>{actionLabel}{resourceName}</BreadcrumbLink>
        <SubHeadingSource>{`${actionLabel}${resourceName}`}</SubHeadingSource>

        <div className="card">
            <div className="card-header header-elements-inline">
                <h5 className="card-title">{`${actionLabel}${resourceName}`}</h5>
            </div>

            <div className="card-body">
                <p className="mb-4">请输入或者选择表单项目，项目<span className="text-danger">*</span>为必选项。</p>

                {!pending ?
                    <Formik key={key} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {({errors, touched, isSubmitting, setFieldValue}) => {
                            return (
                                <Form>
                                    <fieldset className="mb-3">
                                        <legend className="text-uppercase font-size-sm font-weight-bold">基本资料
                                        </legend>

                                        <div className="form-group row">
                                            <label className="col-lg-2 col-form-label font-weight-semibold">名称 <span className="text-danger">*</span></label>

                                            <div className="col-lg-10">
                                                <Field name="title" type="text"
                                                       className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')}/>
                                                <ErrorMessage name="title" component="div" className="invalid-feedback"/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-2 col-form-label font-weight-semibold">排序</label>

                                            <div className="col-lg-10">
                                                <Field name="sort" type="text"
                                                       className={'form-control' + (errors.sort && touched.sort ? ' is-invalid' : '')}/>
                                                <ErrorMessage name="sort" component="div" className="invalid-feedback"/>
                                                <span
                                                    className="form-text text-muted">数字排序，数字越大越靠前</span>
                                            </div>
                                        </div>

                                        <Forms.Image field="coverImage" label="图片" />
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
