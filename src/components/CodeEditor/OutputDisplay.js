import React from 'react';

const OutputDisplay = ({ output }) => {
    return (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Output:</h4>
            <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
    );
};

export default OutputDisplay;