import { DiagnosticSeverity } from "vscode-languageserver";
import { defineDiagnostic } from "./base";

export interface ExampleProps{name: string};
export const ExampleWarning = defineDiagnostic<ExampleProps>(DiagnosticSeverity.Warning, 1, ({name}) => `This is an example with one parameter ${name}`);

export interface Diagnostics {
    ExampleWarning: typeof ExampleWarning,
}

