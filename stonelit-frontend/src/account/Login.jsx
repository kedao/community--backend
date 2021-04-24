import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import classNames from "classnames";
import {Layout} from "@/_components";
import {accountService} from "@/_services";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {ErrorMessage} from "@/_components/Enhances";
import {useToasts} from "react-toast-notifications";

const actionLogin = accountService.loginByPassword;

const validationSchema = Yup.object().shape({
    username: Yup.string().required('请输入用户名'),
    password: Yup.string().required('请输入密码')
});

function Login() {
    const [initialValues] = useState({
        username: '',
        password: '',
    })

    const {addToast} = useToasts();
    const history = useHistory();

    function onSubmit(fields, {setStatus, setSubmitting, setFieldError}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        /*
        if (!isCreateMode) {
            data.id = id;
        }
        */

        setStatus();
        (actionLogin(data.username, data.password)).then((data) => {
            addToast(`登录成功`, {appearance: 'success'});
            // addToast(`${actionLabel}${resource.title}完成`, {appearance: 'success'});
            history.push('/');
        })
        .catch(error => {
            // setFieldError('username', '用户名或者密码错误');
            addToast('登录失败', {appearance: 'error'});
        }).finally(() => {
            setSubmitting(false);
        });
    }

    return (
        <Layout>
            <div className="container home-container u-mb-medium u-mt-medium">
                <div className="o-page__card">
                    <div className="c-card u-mb-xsmall">
                        <header className="c-card__header u-pt-large">
                            <h1 className="u-h3 u-text-center u-mb-zero">用户登录</h1>
                        </header>

                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {({errors, touched, isSubmitting, setFieldValue, setFieldError, setFieldTouched, values, handleSubmit, submitForm, ...others}) => {
                                return (
                                    <Form>
                                        <div className="c-card__body">
                                            <div className="c-field u-mb-small">
                                                <label className="c-field__label" htmlFor="username">用户名</label>
                                                <Field type="text" name="username" id="username"
                                                       className={classNames('c-input', {'c-input--danger': errors.username && touched.username})}/>
                                                <ErrorMessage name="username" />
                                            </div>

                                            <div className="c-field u-mb-small">
                                                <label className="c-field__label" htmlFor="password">密码</label>
                                                <Field type="password" name="password" id="password"
                                                       className={classNames('c-input', {'c-input--danger': errors.password && touched.password})}/>
                                                <ErrorMessage name="password" />
                                            </div>

                                            <button className="c-btn c-btn--info c-btn--fullwidth" type="submit" disabled={isSubmitting}>
                                                {isSubmitting &&
                                                <i className="icon-spinner2 spinner mr-1" />}
                                                登录</button>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export { Login };

export default Login;
