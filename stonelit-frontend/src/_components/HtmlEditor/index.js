import React from 'react';
import PropTypes from "prop-types";
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

class EditorConvertToHTML extends React.Component {

    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null)
    }

    constructor(props) {
        super(props);
        const html = props.value ? props.value : '';
        // this.state.editorState = html;
    }

    handleEditorChange = (editorState) => {
        // this.setState({ editorState })
    }

    render() {
        const { editorState } = this.state

        return (
            <BraftEditor
                /* onChange={this.handleEditorChange} */
            />
        );
    }
}

export default EditorConvertToHTML;
