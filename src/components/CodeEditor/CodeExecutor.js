class CodeExecutor {
    static logs = [];

    static execute(code) {
        return new Promise((resolve) => {
            CodeExecutor.logs = [];
            const originalConsoleLog = console.log;
            console.log = (value) => {
                originalConsoleLog(value);
                CodeExecutor.logs.push(`${value}`);
            };

            try {
                const wrappedCode = `
try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    print(f"Error: {str(e)}")
`;
                window.__BRYTHON__.run_python(wrappedCode);
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }

            console.log = originalConsoleLog;
            setTimeout(() => {
                resolve(CodeExecutor.logs.join('\n'));
            }, 100);
        });
    }
}

export default CodeExecutor;