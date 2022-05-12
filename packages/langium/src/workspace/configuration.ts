/******************************************************************************
 * Copyright 2022 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ConfigurationProvider {
    getConfiguration(section: string, configuration: string): any;
    updateConfiguration(section: string, configuration: any): void;
}

export class DefaultConfigurationProvider implements ConfigurationProvider {

    protected settings: Record<string, Record<string, any>> = {};
    protected workspaceConfigurationSupported = false;

    updateConfiguration(section: string, configuration: any): void {
        this.settings[section] = configuration;
    }

    getConfiguration(section: string, configuration: string): any {
        if(!this.settings[section]) {
            this.settings[section] = {};
        }
        return this.settings[section][configuration];
    }
}
