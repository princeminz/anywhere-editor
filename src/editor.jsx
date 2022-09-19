import React from "react";
import * as monaco from "monaco-editor";
import "./content.css";

export default class MonacoEditor extends React.Component {
  static defaultProps = {
    language: 'plaintext',
    minimap: false,
  };

  componentDidMount() {
    const {value, setValue, language, minimap} = this.props;
    const model = monaco.editor.createModel(value, language);
    this.editor = monaco.editor.create(
      this.editorDiv.current,
      {
        automaticLayout: true,
        minimap: {
          enabled: minimap,
        },
      },
    );
    this.editor.setModel(model);
    this.subscription = model.onDidChangeContent(() => {
      setValue(model.getValue());
    });
    this.editor.layout();
  }

  constructor(props) {
    super(props);
    this.editorDiv = React.createRef();
  }

  render() {
    return <div className="editor" ref={this.editorDiv}></div>;
  }
}
