import React, {useEffect, useState} from 'react';
import classNames from "classnames";
import {Field} from "formik";
import {accountService, articleChannel, media as mediaService, product} from '@/_services';
import {ErrorMessage} from "@/_components/Enhances";
import PictureIcon from "@/_assets/images/picture.svg";
import MediaUpload from "@/_components/MediaUpload";
import AsyncSelectComponent from "react-select/async/dist/react-select.esm";
import {Link} from "react-router-dom";

const selectProduct = inputValue => {
    return product.selectByPage(1, 999999, {
        productName: inputValue,
    }).then((data) => {
        const options = [];
        for (let datum of data.data.list) {
            options.push({
                id: datum.id,
                productName: datum.productName,
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

const GeneralForm = ({errors, touched, values, setFieldValue, setFieldTouched, isVideo}) => {
    const user = accountService.userValue;

    const [articleChannelOptions, setArticleChannelOptions] = useState([]);

    const mediaUploadChange = (media) => {
        const {isUploading} = media;

        if ((typeof media.url === 'string' || media.url instanceof String)) {
            setFieldValue('coverImage', media.url);
        } else {
            setFieldValue('coverImage', '');
        }

        setFieldTouched('coverImage', !isUploading);
    }

    /*
    const mediaOnBlur = () => {
        // console.info('mediaOnBlur');
        // setFieldTouched('coverImage');
    }

    const mediaOnFocus = () => {
        // console.info('mediaOnFocus');
        // setFieldTouched('coverImage');
    }

    const mediaOnClick = () => {
        // setFieldTouched('coverImage');
    }
     */

    useEffect(() => {
        const fetch = async () => {
            const response = await articleChannel.selectSelectItems();
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

            setArticleChannelOptions(options);

            return data;
        };

        fetch();
    }, []);

    return (
        <div className="col-md-5 col-xl-4 u-mb-medium u-hidden-down@tablet">
            <div className="general-card media-card">
                <div className="o-media__body">
                    <h4 className="c-search-result__title">{values.title ? values.title : '预览标题'}</h4>
                    <p className="c-search-result__meta">{user.nickName}</p>
                </div>

                <div className="post-preview">
                    <img className="post-preview-image" src={values.coverImage ? values.coverImage : PictureIcon} alt="" />
                </div>
            </div>

            <MediaUpload onChange={mediaUploadChange}
                         api={mediaService.uploadImage}
                         className={classNames({'dropzone--danger': errors.coverImage && touched.coverImage})}
                         error={touched.coverImage && touched.coverImage ? errors.coverImage : ''}
                         defaultLabel="点击上传封面"
                         uploaded={!!values.coverImage}
            />

            <div className="c-search-form c-search-form--dark">
                <div className="c-search-form__section">

                <label className="c-field__label c-search-form__label"
                       htmlFor="productId">评测产品</label>
                <AsyncSelectComponent
                    placeholder=""
                    defaultOptions={true}
                    loadingMessage={() => '搜索中'}
                    noOptionsMessage={() => '没有匹配结果'}
                    isSearchable={true}
                    isClearable={true}
                    onChange={e => {
                        setFieldValue('productId', e?.id ?? null);
                        setFieldValue('recommendFlag', null);
                    }}
                    styles={
                        {
                            control: base => ({
                                ...base,
                                boxShadow: 'none',
                                borderColor: errors.productId && touched.productId ? 'red' : '#ddd'
                            })
                        }
                    }
                    // defaultValue={categoryOneDTO}
                    getOptionLabel={option => option.productName}
                    getOptionValue={option => option.id}
                    loadOptions={selectProduct}
                    components={{IndicatorSeparator:() => null}}
                />
                <ErrorMessage name="productId" />
                </div>

                <div className="c-search-form__section">
                    <h5 className="c-search-form__label">是否推荐</h5>
                    <div className="u-flex u-flex-with-message">
                        <div className="c-choice c-choice--radio u-mr-small">
                            <Field type="radio" name="recommendFlag" value="1" className="c-choice__input" id="recommendFlag1" checked={values.recommendFlag === '1'} />
                            <label className="c-choice__label" htmlFor="recommendFlag1">推荐</label>
                        </div>

                        <div className="c-choice c-choice--radio">
                            <Field type="radio" name="recommendFlag" value="0" className="c-choice__input" id="recommendFlag0" checked={values.recommendFlag === '0'} />
                            <label className="c-choice__label" htmlFor="recommendFlag0">不推荐</label>
                        </div>

                        {(values.recommendFlag === '1' || values.recommendFlag === '0') && <div className="c-choice--addition">
                            <i className="fa fa-times u-color-danger c-choice--close" onClick={() => setFieldValue('recommendFlag', null)} />
                        </div>}
                    </div>
                    <ErrorMessage name="recommendFlag" />
                </div>

                <div className="c-search-form__section">
                    <div className="c-field">
                        <label className="c-field__label c-search-form__label"
                               htmlFor="testResult">评测结论</label>
                        <Field name="testResult" as="textarea" className={classNames('c-input', {'c-input--danger': errors.testResult && touched.testResult})} />
                        <ErrorMessage name="testResult" />
                    </div>
                </div>
            </div>

            <div className="c-search-form c-search-form--dark">
                <div className="">
                    <div className="c-field ">
                        <label className="c-field__label c-search-form__label"
                               htmlFor="channelId">投稿频道</label>
                        <Field name="channelId" id="channelId" as="select" className={classNames('c-input', {'c-input--danger': errors.channelId && touched.channelId})}>
                            {!values.channelId && <option value=""/>}
                            {articleChannelOptions.filter((e) => e.value !== 1).map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                        </Field>
                        <ErrorMessage name="channelId" />
                    </div>
                </div>
            </div>

            <div className="c-search-form c-search-form--dark">
                <h5 className="c-search-form__label">文章类型</h5>
                <div className="c-search-form__section u-flex">
                    <div className="c-choice c-choice--radio u-mr-small">
                        <Field type="radio" name="articleType" value="0" className="c-choice__input" id="articleType0" />
                        <label className="c-choice__label" htmlFor="articleType0">原创</label>
                    </div>

                    <div className="c-choice c-choice--radio">
                        <Field type="radio" name="articleType" value="1" className="c-choice__input" id="articleType1" />
                        <label className="c-choice__label" htmlFor="articleType1">转载</label>
                    </div>

                    <ErrorMessage name="articleType" />
                </div>

                {values.articleType !== '0' &&
                <div className="c-search-form__section">
                    <div className="c-field">
                        <label className="c-field__label c-search-form__label"
                               htmlFor="originalUrl">转载来源</label>
                        <Field name="originalUrl" type="text" className={classNames('c-input', {'c-input--danger': errors.originalUrl && touched.originalUrl})} />
                        <ErrorMessage name="originalUrl" />
                    </div>
                </div>}

                {values.articleType !== '0' &&
                <div className="c-search-form__section">
                    <h5 className="c-search-form__label">转载授权</h5>
                    <div className="u-flex u-flex-with-message">
                        <div className="c-choice c-choice--radio u-mr-small">
                            <Field type="radio" name="originalAuth" value="0" className="c-choice__input" id="originalAuth0" />
                            <label className="c-choice__label" htmlFor="originalAuth0">未授权</label>
                        </div>

                        <div className="c-choice c-choice--radio">
                            <Field type="radio" name="originalAuth" value="1" className="c-choice__input" id="originalAuth1" />
                            <label className="c-choice__label" htmlFor="originalAuth1">已授权</label>
                        </div>
                    </div>
                    <ErrorMessage name="originalAuth" />
                </div>}

                {values.articleType === '0' &&
                <div className="">
                    <div className="c-field ">
                        <label className="c-field__label c-search-form__label"
                               htmlFor="copyrightNotice">原创版权声明</label>
                        <Field name="copyrightNotice" id="copyrightNotice" as="select" className={classNames('c-input', {'c-input--danger': errors.copyrightNotice && touched.copyrightNotice})}>
                            <option value=""/>
                            <option value="未经授权禁止转载或使用">未经授权禁止转载或使用</option>
                            <option value="转载请注明作者及出处">转载请注明作者及出处</option>
                        </Field>
                        <ErrorMessage name="copyrightNotice" />
                    </div>
                </div>}
            </div>

            <div className="c-choice c-choice--checkbox">
                <Field type="checkbox" name="acceptTerms" className="c-choice__input" id="acceptTerms" />
                <label className="c-choice__label agree-label" htmlFor="acceptTerms">我已阅读并接受<a href="/page/16" target="_blank">《内容创作规范》</a>和<a href={isVideo ? '/page/18' : '/page/17'} target="_blank">《{isVideo ? '视频投稿协议' : '文章投稿协议'}》</a></label>
                <ErrorMessage name="acceptTerms" />
            </div>
        </div>
    );
}

export default GeneralForm;
