/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { DefaultRenameHandler, LangiumDocument, LangiumDocuments, LangiumServices} from 'langium';
import { WorkspaceEdit, Location, Range } from 'vscode-languageserver';
import { RenameParams } from 'vscode-languageserver-protocol';
import { TextEdit } from 'vscode-languageserver-types';
import { URI } from 'vscode-uri';

export class DomainModelRenameHandler extends DefaultRenameHandler {

    protected readonly langiumDocuments: LangiumDocuments
    constructor(services: LangiumServices) {
        super(services);
        this.langiumDocuments = services.shared.workspace.LangiumDocuments;
    }

    async renameElement(document: LangiumDocument, params: RenameParams): Promise<WorkspaceEdit | undefined> {
        const changes: Record<string, TextEdit[]> = {};
        const references = await this.referenceFinder.findReferences(document, { ...params, context: { includeDeclaration: true } });
        if (!Array.isArray(references)) {
            return undefined;
        }
        references.forEach(location => {
            const adjustedRange: Range = this.getRangeWithoutQualifier(location);
            const change = TextEdit.replace(adjustedRange, params.newName);
            if (changes[location.uri]) {
                changes[location.uri].push(change);
            } else {
                changes[location.uri] = [change];
            }
        });
        return { changes };
    }

    getRangeWithoutQualifier(location: Location): Range {
        const langiumDoc = this.langiumDocuments.getOrCreateDocument(URI.parse(location.uri));
        const locationText = langiumDoc.textDocument.getText(location.range);
        const lastDotIndex =locationText.lastIndexOf('.');
        if (lastDotIndex === -1) return location.range;
        const retRange: Range = {
            start: { line: location.range.start.line, character: location.range.start.character + lastDotIndex + 1},
            end : { line: location.range.end.line, character : location.range.end.character }
        };
        return retRange;
    }
}
