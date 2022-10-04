import React from "react";
import * as monaco from "monaco-editor";
import "./content.css";

export default class MonacoDiffEditor extends React.Component {
  static defaultProps = {
    language: 'plaintext'
  };

  componentDidMount() {
    const {value, setValue, secondValue, language} = this.props;
    
    const model = monaco.editor.createModel(value, language);
    const secondModel = monaco.editor.createModel(secondValue, language);

    this.editor = monaco.editor.createDiffEditor(
      this.editorDiv.current,
      {
        automaticLayout: true,
      },
    );
    this.editor.setModel({
      original: model,
      modified: secondModel
    });

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
