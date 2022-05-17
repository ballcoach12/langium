export abstract class DiagnosticBase<P> extends Error {
    readonly properties: Readonly<P>;
    readonly code: string;
    readonly message: string;
    constructor(code: string, properties: P) {
        super();
        this.properties = properties;
        this.code = code;
        this.message = this.createMessage();
    }
    protected abstract createMessage(): string;
}

export type DiagnosticConstructor<P> = {
    new(properties: P): DiagnosticBase<P>;
    readonly Code: string;
};

export function defineDiagnostic<P>(code: string, messageTemplate: (props: P) => string): DiagnosticConstructor<P> {
    class NewError extends DiagnosticBase<P>  {
        static readonly Code: string = code;
        constructor(properties: P) {
            super(code, properties);
        }
        protected createMessage(): string {
            return messageTemplate(this.properties);
        }
    }
    return NewError;
}