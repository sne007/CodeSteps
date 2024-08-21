import React, { useState, useRef, useEffect } from 'react';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import { FaPlay, FaTrash, FaUndo, FaRedo } from 'react-icons/fa';
import { Helmet } from "react-helmet";
import { useCurriculum } from "../context/CurriculumContext";
import { animateStars } from "../../utils/animateStars";

let logs = [];

console.oldLog = console.log;
console.log = function (value) {
    console.oldLog(value);
    logs.push(`${value}`);
};

const Scripts = ({ code }) => {
    const wrappedCode = `
try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    print(f"Error: {str(e)}")
`;
    return <script type="text/python">{wrappedCode}</script>;
};

const CodeEditor = () => {
    const { selectedQuestion, score, setScore } = useCurriculum();
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        if (window.brython) {
            window.brython(1);
        }
    }, []);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    const runCode = () => {
        setIsExecuting(true);
        logs = [];
        try {
            window.brython([1]);
        } catch (error) {
            console.oldLog(error);
        }

        setTimeout(() => {
            setOutput(logs.join('\n'));
            setIsExecuting(false);
        }, 100);
    };

    const handleClearCode = () => {
        setCode('');
        setOutput('');
        setFeedback(null);
    };

    const handleSubmit = () => {
        setFeedback({ type: 'success', message: 'Correct! Great job!' });
        if (selectedQuestion) {
            animateStars(selectedQuestion.points, setScore);
        }
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && event.shiftKey) {
            event.preventDefault();
        }
    };

    if (!selectedQuestion) {
        return <div>Select a question to start coding.</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <Helmet>
                <script
                    type="text/javascript"
                    src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.7.1/brython.min.js"
                />
                <script
                    type="text/javascript"
                    src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.7.1/brython_stdlib.js"
                />
            </Helmet>
            <Scripts code={code} />
            <h3 className="text-xl font-bold mb-4 text-indigo-900">
                Question {selectedQuestion.id}: {selectedQuestion.title}
            </h3>
            <p className="text-gray-600 mb-4">{selectedQuestion.description}</p>
            <div className="mb-4" ref={editorRef}>
                <div className="bg-gray-800 text-white p-2 rounded-t-lg flex justify-between items-center">
                    <div className="flex space-x-2">
                        <button onClick={runCode} className="p-1 hover:bg-gray-700 rounded" title="Run Code">
                            <FaPlay />
                        </button>
                        <button onClick={handleClearCode} className="p-1 hover:bg-gray-700 rounded" title="Clear Code">
                            <FaTrash />
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded" title="Undo">
                            <FaUndo />
                        </button>
                        <button className="p-1 hover:bg-gray-700 rounded" title="Redo">
                            <FaRedo />
                        </button>
                    </div>
                </div>
                <AceEditor
                    mode="python"
                    theme="monokai"
                    onChange={handleCodeChange}
                    onKeyDown={handleKeyDown}
                    name="python-editor"
                    editorProps={{ $blockScrolling: true }}
                    width="100%"
                    height="200px"
                    fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={code}
                    commands={[{
                        name: 'run',
                        bindKey: {win: 'Shift-Enter', mac: 'Shift-Enter'},
                        exec: handleSubmit
                    }]}
                />
            </div>
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Output:</h4>
                <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    onClick={runCode}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center"
                    disabled={isExecuting}
                >
                    <FaPlay className="mr-2" /> {isExecuting ? 'Running...' : 'Run Code'}
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                >
                    Submit Answer
                </button>
            </div>
            {feedback && (
                <div className={`mt-4 p-3 rounded-lg ${
                    feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
};

export default CodeEditor;