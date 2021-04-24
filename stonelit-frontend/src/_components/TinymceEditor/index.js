import React from 'react';
import {media} from "@/_services";
import './index.css'

class TinymceEditor extends React.Component {

    constructor(props) {
        super(props);
        // this.element = React.createRef();

        // this.state.editorState = html;
    }

    /* eslint-disable */
    componentDidMount() {

        const {onChange, onBlur, onFocus, value} = this.props;

        // $('#rich-editor').html(value);

        tinymce.init({
            selector: '#rich-editor',
            language: 'zh_CN',
            menubar: false,
            plugins: 'advlist anchor autolink autosave axupimgs charmap code codesample print preview searchreplace fullscreen image link media table hr pagebreak nonbreaking lists textpattern help emoticons',
            toolbar: 'bold italic underline strikethrough forecolor backcolor | formatselect fontsizeselect | alignleft aligncenter alignright alignjustify | \
                        bullist numlist blockquote removeformat | link image emoticons code hr | preview fullscreen',
            fixed_toolbar_container: '#doc-app .toolbar',
            custom_ui_selector: 'body',
            placeholder: '',
            //auto_focus: true,
            toolbar_mode: 'wrap',
            toolbar_sticky: true,
            autosave_ask_before_unload: false,
            fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
            height: '500px',
            setup : function(ed) {
                ed.on('init', function()
                {
                    $(ed.getBody()).on('blur', function(e) {
                        onBlur && onBlur(e);
                    });
                    $(ed.getBody()).on('focus', function(e) {
                        onFocus && onFocus(e);
                    });
                });
                ed.on('change', (e) => {
                    onChange && onChange(ed.getContent());
                });
                ed.on('keyUp', (e) => {
                    onChange && onChange(ed.getContent());
                })
            },
            images_upload_handler: (blobInfo, succFun, failFun) => {
                media.uploadImage(blobInfo.blob(), (event) => {
                })
                    .then((data) => {
                        return data.data;
                    })
                    .then((data) => {
                        succFun(data.url);
                    })
                    .catch((e) => {
                        failFun('图片上传失败');
                    });
            },
            init_instance_callback: (editor) => {
                $('#doc-app').fadeIn(1500);
                editor.execCommand('selectAll');
                editor.selection.getRng().collapse(false);
                editor.focus();
            }
        }).then((res) => {
            tinymce.get("rich-editor").setContent(value);
        });
    }

    /* eslint-disable */
    componentWillUnmount() {
        tinymce.remove();
    }

    render() {
        return (
            <div id="rich-editor"
                /* onChange={this.handleEditorChange} */
            />
        );
    }
}

export default TinymceEditor;
