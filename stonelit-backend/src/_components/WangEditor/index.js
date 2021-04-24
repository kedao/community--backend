import React from 'react';
import E from "wangeditor";
import config from 'config';
import {useToasts} from "react-toast-notifications";
import {accountService} from "@/_services";
import './index.css'

function withToast(Component) {
    return function WrappedComponent(props) {
        const toastFuncs = useToasts()
        return <Component {...props} {...toastFuncs} />;
    }
}

class WangEditor extends React.Component {

    constructor(props) {
        super(props);
        this.element = React.createRef();

        // this.state.editorState = html;
    }

    componentDidMount() {
        const {accessToken} = accountService.userValue;

        const {onChange, onError, onBlur, onFocus, addToast, value} = this.props;

        const url = `${config.apiUrl}/smart/api/common/file/uploadImage`;

        const editor = new E(this.element.current);

        editor.config.uploadImgServer = url;
        editor.config.uploadFileName = 'file';
        editor.config.uploadImgMaxSize = 1024 * 1024 * 1024;
        editor.config.uploadImgTimeout = 60 * 1000;

        if (onChange) {
            editor.config.onchange = onChange;
        }
        if (onBlur) {
            editor.config.onblur = onBlur;
        }
        if (onFocus) {
            editor.config.onfocus = onFocus;
        }

        // this.props.addToast('Hello Toast');

        editor.config.customAlert = (error) => {
            if (onError) {
                onError(error);
            } else {
                addToast(error, {appearance: 'error'});
            }
        }

        editor.config.uploadImgHeaders = {
            Authorization: accessToken,
        }

        editor.config.uploadImgHooks = {
            customInsert: function (insertImgFn, result) {
                insertImgFn(result.data.url);
            }
        }

        /*
        editor.config.customUploadImg = function (resultFiles, insertImgFn) {
            console.log('customUploadImg', resultFiles)
            Array.from(resultFiles).forEach(file => {
                insertImgFn(URL.createObjectURL(file))
            })
        }
        */

        editor.config.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ];

        editor.create();
        if (value) {
            editor.txt.html(value);
        }
    }

    handleEditorChange = (editorState) => {
        // this.setState({ editorState })
    }

    render() {
        return (
            <div ref={this.element}
                /* onChange={this.handleEditorChange} */
            />
        );
    }
}

export default withToast(WangEditor);
