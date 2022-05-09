import { DiagnosticSeverity } from "vscode-languageserver";

export abstract class DiagnosticBase<P> {
    readonly properties: Readonly<P>;
    readonly code: string;
    readonly message: string;
    constructor(codeType: DiagnosticSeverity, codeId: number, properties: P) {
        this.properties = properties;
        this.code = severityToCodePrefix(codeType)+prependLeadingZero(codeId, 4);
        this.message = this.createMessage();
    }
    protected abstract createMessage(): string;
}

export function defineDiagnostic<P>(codeType: DiagnosticSeverity, codeId: number, messageTemplate: (props: P) => string): new(properties: P) => DiagnosticBase<P> {
    class NewError extends DiagnosticBase<P>  {
        constructor(properties: P) {
            super(codeType, codeId, properties);
        } 
        protected createMessage(): string {
            return messageTemplate(this.properties);
        }
    }
    return NewError; 
}

function severityToCodePrefix(severity: DiagnosticSeverity) {
    switch(severity) {
        case DiagnosticSeverity.Error: return "ERR";
        case DiagnosticSeverity.Warning: return "WARN";
        case DiagnosticSeverity.Information: return "INFO";
        case DiagnosticSeverity.Hint: return "HINT";
    }
    assertUnreachable(severity);
}

function prependLeadingZero(num: number, digits: number): string {
    let str = Math.floor(num).toString();
    while(str.length < digits) {
        str = '0'+str;
    }
    return str;
}

function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here");
}