import React from 'react';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./index.css";

function uploadImageCallBack(file) {
    return new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
            xhr.open('POST', 'https://api.imgur.com/3/image');
            xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
            const data = new FormData(); // eslint-disable-line no-undef
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        },
    );
}

const ImageUpload = () => {
    const onContentStateChange = contentState => {
        // console.log('as HTML:', draftToHtml(contentState));

        console.info(contentState);
    }

    return (<Editor
        onContentStateChange={onContentStateChange}

        toolbarClassName="rdw-toolbar"
        wrapperClassName="rdw-wrapper"
        editorClassName="rdw-editor"
        localization={{
            locale: 'zh',
        }}
        toolbar={{
            /*
            image: {
                uploadCallback: uploadImageCallBack,
                alt: {present: true, mandatory: false},
                popupClassName: 'popup-toolbar-editor-position',
            },
             */
            link: {
                popupClassName: 'popup-toolbar-editor-position',
            },
            colorPicker: {
                popupClassName: 'popup-toolbar-editor-position',
            },

            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
        }}
    />);
}

// export default ImageUpload;


export default class EditorConvertToHTML extends React.Component {

    constructor(props) {
        super(props);
        const html = props.value ? props.value : '';
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        }
    }

    onEditorStateChange = (editorState) => {
        const {onChange} = this.props;
        this.setState({
            editorState,
        });

        if (onChange) {
            const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            onChange(html);
        }
    };

    render() {
        const {editorState} = this.state;
        const {onChange, value, ...others} = this.props;

        const props = {
            ...others,
            ...{
                toolbarClassName: "rdw-toolbar",
                wrapperClassName: "rdw-wrapper",
                editorClassName: "rdw-editor",
                localization: {
                    locale: 'zh',
                },
                toolbar: {
                    image: {
                        uploadCallback: uploadImageCallBack,
                        alt: {present: true, mandatory: false},
                        popupClassName: 'popup-toolbar-editor-position',
                    },
                    link: {
                        popupClassName: 'popup-toolbar-editor-position',
                    },
                    colorPicker: {
                        popupClassName: 'popup-toolbar-editor-position',
                    },
                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
                }
            }
        };

        return (
            <Editor
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
                {...props}
            />
        );
    }
};
