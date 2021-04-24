import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";

import HtmlEditor from "@/_components/WangEditor";

import {ErrorMessage} from "@/_components/Enhances";
import {communityPost as resource, community} from "@/_services";
import {useToasts} from "react-toast-notifications";

const actionCreate = resource.create;
const actionUpdate = resource.update;

const validationSchema = Yup.object().shape({
    title: Yup.string().required('请输入标题'),
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

function Post({history}) {
    const {addToast} = useToasts();

    const [initialValues] = useState({
        title: '',
        channelId: '',
        articleType: '0',
        coverImage: '',
        copyrightNotice: '',
        originalUrl: '',
        originalAuth: '',
        details: '',
        acceptTerms: false,
        state: 0,
    });
    const [communityOptions, setCommunityOptions] = useState([]);

    const isCreateMode = true;
    const actionLabel = isCreateMode ? '投稿' : '编辑';

    useEffect(() => {
        const fetch = async () => {
            const response = await community.selectSelectItems();
            const data = response.data;
            const options = [];

            for (let datum of data) {
                options.push(
                    {
                        value: datum.id,
                        label: datum.title,
                    }
                );
            }

            setCommunityOptions(options);

            return data;
        };

        fetch();
    }, []);

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        data.productId = 1;

        /*
        if (!isCreateMode) {
            data.id = id;
        }
         */

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

    return (
        <Formik initialValues={initialValues} validate={validate} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({errors, touched, isSubmitting, setFieldValue, setFieldTouched, values, handleSubmit, submitForm, ...others}) => {
                return (
                    <Form onSubmit={handleSubmit}>
                        <div className="container u-mt-medium">
                            <div className="row">
                                <div className="col-md-7 col-xl-8">
                                    <div className="c-search-form c-search-form--dark">
                                        <div className="">
                                            <div className="c-field ">
                                                <label className="c-field__label c-search-form__label"
                                                       htmlFor="search-location">标题</label>
                                                <Field name="title" type="text"
                                                       className={classNames('c-input', {'c-input--danger': errors.title && touched.title})}/>
                                                <ErrorMessage name="title" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="c-card">
                                        <HtmlEditor value={initialValues.details}
                                                    onFocus={() => setFieldTouched('details', false)}
                                                    onBlur={() => setFieldTouched('details', true)}
                                                    onChange={(e) => setFieldValue('details', e)} />
                                        <ErrorMessage name="details" />
                                    </div>

                                    <div className="u-justify-center">
                                        <div className="u-flex u-mt-medium u-justify-center">
                                            <button type="button" className="c-btn c-btn--info u-mr-xsmall" onClick={() => setFieldValue('state', 1) && submitForm()}>投稿</button>
                                            <button type="button" className="c-btn c-btn--secondary" onClick={() => setFieldValue('state', 0) && submitForm()}>保存草稿</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-5 col-xl-4 u-mb-medium u-hidden-down@tablet">
                                    <div className="c-search-form c-search-form--dark">
                                        <div className="">
                                            <div className="c-field ">
                                                <label className="c-field__label c-search-form__label"
                                                       htmlFor="channelId">社区</label>
                                                <Field name="channelId" id="channelId" as="select" className={classNames('c-input', {'c-input--danger': errors.channelId && touched.channelId})}>
                                                    <option value=""/>
                                                    {communityOptions.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                                                </Field>
                                                <ErrorMessage name="channelId" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default Post;
