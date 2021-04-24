import React, {useState, useEffect} from 'react';
import {useRouteMatch} from "react-router-dom";
import classNames from 'classnames';
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import HtmlEditor from "@/_components/TinymceEditor";
import GeneralForm from "./components/GeneralForm";
import {ErrorMessage} from "@/_components/Enhances";
import {articleAdmin as resource} from "@/_services";
import {useToasts} from "react-toast-notifications";

const actionCreate = resource.create;
const actionUpdate = resource.update;

const validationSchema = Yup.object().shape({
    title: Yup.string().required('请输入标题'),
    // details: Yup.string().required('请输入内容'),
    productId: Yup.string(),
    recommendFlag: Yup.string().nullable(),
    testResult: Yup.string(),
    channelId: Yup.string().required('请选择投稿频道'),
    coverImage: Yup.string().required('请选择上传封面图片'),
    copyrightNotice: Yup.string().when('articleType', {
        is: '0',
        then: Yup.string().required('请选择原创版权声明')
    }),
    originalUrl: Yup.string().when('articleType', {
        is: '1',
        then: Yup.string().required('请输入转载来源')
    }),
    originalAuth: Yup.string().when('articleType', {
        is: '1',
        then: Yup.string().required('请选择转载授权')
    }),
    acceptTerms: Yup.bool().oneOf([true], '请阅读并接受条款'),
});

const validate = values => {
    const errors = {};

    const regex = /(<([^>]+)>)/ig
    const result = values.details.replace(regex, "");

    if (!result.trim()) {
        errors.details = '请输入内容';
    }

    return errors;
};

function PostText({history}) {
    const match = useRouteMatch();
    const {id} = match.params;
    const isCreateMode = !id;

    const {addToast} = useToasts();
    const [pending, setPending] = useState(true);
    const [initialValues, setInitialValues] = useState({
        title: '',
        productId: '',
        channelId: '',
        articleType: '0',
        coverImage: '',
        copyrightNotice: '',
        originalUrl: '',
        originalAuth: '',
        details: '',
        recommendFlag: '',
        testResult: '',
        acceptTerms: false,
        state: 0,
    })

    useEffect(() => {
        const fetcher = async (id) => {
            const response = await resource.selectById(id);
            const data = {};
            Object.keys(initialValues).forEach((field) => data[field] = response.data[field]);
            if (!data.channelId) {
                data.channelId = '';
            }
            if (!data.productId) {
                data.productId = '';
            }
            if (!data.originalAuth) {
                data.originalAuth = '0';
            }
            data.articleType = data.articleType ? data.articleType.toString() : '0';
            data.originalAuth = data.originalAuth ? data.originalAuth.toString() : '';
            data.recommendFlag = data.recommendFlag ? data.recommendFlag.toString() : '';
            setInitialValues(data);
            setPending(false);
        };

        if (isCreateMode) {
            setPending(false);
        } else {
            fetcher(id)
        }
    }, [id]);

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        data.state = 1;

        if (!isCreateMode) {
            data.id = id;
        }

        setStatus();
        (isCreateMode ? actionCreate(data) : actionUpdate(data)).then(() => {
            addToast(`文章投稿完成`, {appearance: 'success'});
            history.push('/my');
        }).catch(error => {
            addToast(error ?? `文章投稿失败`, {appearance: 'error'});
            setSubmitting(false);
        });
    }

    if (pending) {
        return <div>Loading</div>;
    }

    return (
        <Formik initialValues={initialValues} validate={validate} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({errors, touched, isSubmitting, setSubmitting, setFieldValue, setFieldTouched, values, setErrors, handleSubmit, submitForm, ...others}) => {
                const handleSaveDraft = (fields) => {
                    const data = {};
                    Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

                    setErrors({
                        title: '请输入标题'
                    });
                    setFieldTouched('contents', false);

                    if (!values.title) {
                        return setFieldTouched('title', true);
                    } else {
                        setFieldTouched('title', false);
                    }

                    data.state = 0;
                    if (!isCreateMode) {
                        data.id = id;
                    }

                    setSubmitting(true);

                    (isCreateMode ? actionCreate(values) : actionUpdate(data)).then(() => {
                        addToast(`保存草稿完成`, {appearance: 'success'});
                        history.push('/my');
                    })
                    .catch(error => {
                        addToast(error ?? `保存草稿失败`, {appearance: 'error'});
                        setSubmitting(false);
                    })
                    // .finally(() => setSubmitting(false))
                }

                return (
                    <Form onSubmit={handleSubmit}>
                        <div className="container u-mt-medium">
                            <div className="row">
                                <div className="col-md-7 col-xl-8">
                                    <div className="c-search-form c-search-form--dark">
                                        <div className="c-field ">
                                            <label className="c-field__label c-search-form__label"
                                                   htmlFor="search-location">文章标题</label>
                                            <Field name="title" type="text"
                                                   className={classNames('c-input', {'c-input--danger': errors.title && touched.title})}/>
                                            <ErrorMessage name="title" />
                                        </div>
                                    </div>

                                    <div className="c-card">
                                        <HtmlEditor value={initialValues.details}
                                                    onFocus={() => setFieldTouched('details', false)}
                                                    onBlur={() => setFieldTouched('details', true)}
                                                    onChange={(e) => setFieldValue('details', e)} />
                                        <ErrorMessage name="details" className="u-m-xsmall" />
                                    </div>

                                    <div className="u-justify-center">
                                        <div className="u-flex u-mt-medium u-justify-center">
                                            <button type="submit" className="c-btn c-btn--info u-mr-xsmall">投稿</button>
                                            <button type="button" className="c-btn c-btn--secondary" onClick={() => handleSaveDraft(values)}>保存草稿</button>
                                        </div>
                                    </div>
                                </div>

                                <GeneralForm errors={errors} touched={touched} values={values} isVideo={false}
                                             setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default PostText;
