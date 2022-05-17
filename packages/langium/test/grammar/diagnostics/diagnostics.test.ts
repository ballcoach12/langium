import { defineDiagnostic } from "../../../src/grammar/diagnostics/base";

describe('Diagnostic framework', () => {
    interface ExampleProps { name: string };
    const ExampleWarning = defineDiagnostic<ExampleProps>("WARN0001", ({ name }) => `This is an example with one parameter ${name}`);
    const Diagnostics = { ExampleWarning, };
    
    it('should create a diagnostic', () => {
        const warning = new ExampleWarning({ name: "Markus" });
        expect(warning.message).toBe('This is an example with one parameter Markus');
        expect(warning.code).toBe(Diagnostics.ExampleWarning.Code);
        expect(warning.properties.name).toBe("Markus");
    })
})
