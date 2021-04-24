import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import {useToasts} from "react-toast-notifications";
import * as Yup from 'yup';

import {community, communityCategory} from '@/_services';
import { BreadcrumbLink } from "@/_teleporters/Breadcrumb";
import { SubHeadingSource } from "@/_teleporters/Heading";

import {resourceName} from "./";
import Forms from "@/_components/Forms";

const actionFetch = community.selectById;
const actionCreate = community.create;
const actionUpdate = community.update;

// const promiseOptions = communityCategory.selectSelectItems;

const selectCommunityCategories = inputValue => {
    return communityCategory.selectByPage(1, 999999, inputValue).then((data) => {
        const options = [];
        for (let datum of data.data.list) {
            options.push({
                value: datum.id,
                label: datum.title,
            });
        }

        return options;
    });
}

/*
const promiseOptions = inputValue =>
    new Promise(resolve => {
        searchBridges(inputValue).then((data) => {
            const options = [];
            for (let datum of data) {
                options.push({
                    value: datum.id,
                    label: datum.name,
                });
            }

            resolve(options);
        }).catch((e) => console.error(e))
    });
*/

const validationSchema = Yup.object().shape({
    title: Yup.string().required('请输入名称'),
    sort: Yup.number(),
    categoryId: Yup.string().required('请选择社区类目'),
    coverImage: Yup.string().required('请上传图片'),
});

const Editor = ({history, match}) => {
    const id = match.params.id;
    const isCreateMode = !id;
    const actionLabel = isCreateMode ? '添加' : '编辑';
    const key = id ?? 'create';

    const {addToast} = useToasts();
    const [pending, setPending] = useState(false);
    const [files, setFiles] = useState([]);
    const [coverImage, setCoverImage] = useState('');
    const [category, setCategory] = useState('');
    const [uploadStates, setUploadStates] = useState({});
    const [initialValues, setInitialValues] = useState({
        title: '',
        boutiqueFlag: '0',
        topFlag: '0',
        sort: '',
        categoryId: '',
        coverImage: '',
    })

    const fetcher = async (id) => {
        const response = await actionFetch(id);
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = response.data[field]);
        setInitialValues(data);
        //if (response.data.coverImage) {
        //    setCoverImage(response.data.coverImage);
        //}
        if (response.data.categoryId && response.data.categoryName) {
            setCategory({value: response.data.categoryId, label: response.data.categoryName});
        }
        setPending(true);

        /*
        const selects = await communityCategory.selectSelectItems();
        console.info(selects)
         */
    };

    useEffect(() => {
        if (isCreateMode) {
            setPending(true);
        } else {
            fetcher(id)
        }
    }, [id]);

    const onUploadImagesChange = (files, uploadStates) => {
        setFiles(files);
        setUploadStates(uploadStates);
    }

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        if (!isCreateMode) {
            data.id = id;
        }
        if (data.sort === '') {
            data.sort = '0';
        }

        setStatus();
        (isCreateMode ? actionCreate(data) : actionUpdate(data)).then(() => {
            addToast(`${actionLabel}${resourceName}完成`, {appearance: 'success'});
            history.push(isCreateMode ? '.' : '..');
        })
        .catch(error => {
            addToast(error || `${actionLabel}${resourceName}失败`, {appearance: 'error'});
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

                {pending ?
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
                                                <ErrorMessage name="title" component="div"
                                                              className="invalid-feedback"/>

                                            </div>
                                        </div>

                                        <Forms.AsyncSelect field="categoryId" label="社区类目"
                                                              defaultValue={category}
                                                              loadOptions={selectCommunityCategories}
                                                              components={{IndicatorSeparator:() => null}}
                                        />

                                        <Forms.Image field="coverImage" label="图片" required={true} />

                                        <div className="form-group row">
                                            <label className="col-lg-2 col-form-label font-weight-semibold">是否加精</label>

                                            <div className="col-lg-10">
                                                <Field name="boutiqueFlag" as="select"
                                                       className={'form-control' + (errors.boutiqueFlag && touched.boutiqueFlag ? ' is-invalid' : '')}>
                                                    <option value="1">是</option>
                                                    <option value="0">否</option>
                                                </Field>
                                                <ErrorMessage name="boutiqueFlag" component="div"
                                                              className="invalid-feedback"/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-2 col-form-label font-weight-semibold">是否置顶</label>

                                            <div className="col-lg-10">
                                                <Field name="topFlag" as="select"
                                                       className={'form-control' + (errors.topFlag && touched.topFlag ? ' is-invalid' : '')}>
                                                    <option value="1">是</option>
                                                    <option value="0">否</option>
                                                </Field>
                                                <ErrorMessage name="topFlag" component="div"
                                                              className="invalid-feedback"/>
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
