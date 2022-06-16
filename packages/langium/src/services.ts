/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

// Ensure that all imports are erased at runtime to avoid circular dependencies.
import type { Connection, TextDocuments } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { Grammar } from './grammar/generated/ast';
import type { GrammarConfig } from './grammar/grammar-config';
import type { LanguageMetaData } from './grammar/language-meta-data';
import type { CodeActionProvider } from './lsp/code-action';
import type { CompletionProvider } from './lsp/completion/completion-provider';
import type { RuleInterpreter } from './lsp/completion/rule-interpreter';
import type { DocumentHighlighter } from './lsp/document-highlighter';
import type { DocumentSymbolProvider } from './lsp/document-symbol-provider';
import type { FoldingRangeProvider } from './lsp/folding-range-provider';
import type { Formatter } from './lsp/formatter';
import type { GoToResolver } from './lsp/goto';
import type { HoverProvider } from './lsp/hover-provider';
import type { ReferenceFinder } from './lsp/reference-finder';
import type { RenameHandler } from './lsp/rename-refactoring';
import type { SemanticTokenProvider } from './lsp/semantic-token-provider';
import type { LangiumParser } from './parser/langium-parser';
import type { IParserConfig } from './parser/parser-config';
import type { TokenBuilder } from './parser/token-builder';
import type { ValueConverter } from './parser/value-converter';
import type { Linker } from './references/linker';
import type { NameProvider } from './references/naming';
import type { References } from './references/references';
import type { ScopeComputation, ScopeProvider } from './references/scope';
import type { JsonSerializer } from './serializer/json-serializer';
import type { ServiceRegistry } from './service-registry';
import type { AstReflection } from './syntax-tree';
import type { DocumentValidator } from './validation/document-validator';
import type { ValidationRegistry } from './validation/validation-registry';
import type { AstNodeDescriptionProvider, ReferenceDescriptionProvider } from './workspace/ast-descriptions';
import type { AstNodeLocator } from './workspace/ast-node-locator';
import type { DocumentBuilder } from './workspace/document-builder';
import type { LangiumDocumentFactory, LangiumDocuments, TextDocumentFactory } from './workspace/documents';
import type { FileSystemProvider } from './workspace/file-system-provider';
import type { IndexManager } from './workspace/index-manager';
import type { WorkspaceManager } from './workspace/workspace-manager';

/**
 * The services generated by `langium-cli` for a single language. These are derived from the
 * grammar definition and the language configuration.
 */
export type LangiumGeneratedServices = {
    Grammar: Grammar
    LanguageMetaData: LanguageMetaData
    parser: {
        ParserConfig?: IParserConfig
    }
}

/**
 * Services related to the Language Server Protocol (LSP).
 */
export type LangiumLspServices = {
    completion: {
        CompletionProvider: CompletionProvider
        RuleInterpreter: RuleInterpreter
    }
    DocumentHighlighter: DocumentHighlighter
    DocumentSymbolProvider: DocumentSymbolProvider
    HoverProvider: HoverProvider
    FoldingRangeProvider: FoldingRangeProvider
    GoToResolver: GoToResolver
    ReferenceFinder: ReferenceFinder
    CodeActionProvider?: CodeActionProvider
    SemanticTokenProvider?: SemanticTokenProvider
    RenameHandler: RenameHandler
    Formatter?: Formatter
}

/**
 * Services for a single language where Langium provides default implementations.
 */
export type LangiumDefaultServices = {
    lsp: LangiumLspServices
    parser: {
        GrammarConfig: GrammarConfig
        ValueConverter: ValueConverter
        LangiumParser: LangiumParser
        TokenBuilder: TokenBuilder
    }
    references: {
        Linker: Linker
        NameProvider: NameProvider
        References: References
        ScopeProvider: ScopeProvider
        ScopeComputation: ScopeComputation
    }
    serializer: {
        JsonSerializer: JsonSerializer
    }
    validation: {
        DocumentValidator: DocumentValidator
        ValidationRegistry: ValidationRegistry
    }
    workspace: {
        AstNodeLocator: AstNodeLocator
        AstNodeDescriptionProvider: AstNodeDescriptionProvider
        ReferenceDescriptionProvider: ReferenceDescriptionProvider
    }
    shared: LangiumSharedServices
}

/**
 * The full set of services available for a language. These are either generated by `langium-cli`
 * or provided as default implementations.
 */
export type LangiumServices = LangiumGeneratedServices & LangiumDefaultServices

/**
 * The services generated by `langium-cli` that are shared between multiple languages. These are
 * derived from the grammar definition.
 */
export type LangiumGeneratedSharedServices = {
    AstReflection: AstReflection
}

/**
 * Services shared between multiple languages where Langium provides default implementations.
 */
export type LangiumDefaultSharedServices = {
    ServiceRegistry: ServiceRegistry
    lsp: {
        Connection?: Connection
    }
    workspace: {
        DocumentBuilder: DocumentBuilder
        IndexManager: IndexManager
        LangiumDocuments: LangiumDocuments
        LangiumDocumentFactory: LangiumDocumentFactory
        TextDocuments: TextDocuments<TextDocument>
        TextDocumentFactory: TextDocumentFactory
        WorkspaceManager: WorkspaceManager
        FileSystemProvider: FileSystemProvider
    }
}

/**
 * The shared services are a set of services that are used by every language within a Langium project.
 * This is necessary to enable features like cross references across different languages.
 */
export type LangiumSharedServices = LangiumDefaultSharedServices & LangiumGeneratedSharedServices

/**
 * A deep partial type definition for services. We look into T to see whether its type definition contains
 * any methods. If it does, it's one of our services and therefore should not be partialized.
 */
//eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T[keyof T] extends Function ? T : {
    [P in keyof T]?: DeepPartial<T[P]>;
}

/**
 * Language-specific services to be partially overridden via dependency injection.
 */
export type PartialLangiumServices = DeepPartial<LangiumServices>

/**
 * Shared services to be partially overridden via dependency injection.
 */
export type PartialLangiumSharedServices = DeepPartial<LangiumSharedServices>
