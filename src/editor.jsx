import React from "react";
import * as monaco from "monaco-editor";
import "./content.css";

self.MonacoEnvironment = {
	getWorker: function (workerId, label) {
		const getWorkerModule = (moduleUrl, label) => {
			return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
				name: label,
				type: 'module'
			});
		};

		switch (label) {
			case 'json':
				return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
			case 'css':
			case 'scss':
			case 'less':
				return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
			case 'html':
			case 'handlebars':
			case 'razor':
				return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
			case 'typescript':
			case 'javascript':
				return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
			default:
				return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
		}
	}
};

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
