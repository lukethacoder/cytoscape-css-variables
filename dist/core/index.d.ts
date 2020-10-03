import { Core } from 'cytoscape';
interface Options {
    initialVars?: {
        [key: string]: string;
    };
    domEl?: HTMLElement;
}
declare global {
    interface Element {
        visible: () => boolean;
    }
}
export default class CssVarsPlugin {
    readonly _cy: Core;
    readonly _options: Options;
    _domEl: HTMLElement | null;
    _domElComputedStyle: CSSStyleDeclaration | null;
    css_vars_obj: {
        [key: string]: string;
    };
    css_vars_keys: string[];
    constructor(cy: Core, options?: Options);
    /**
     * @description Refresh the computed style of the current Dom Element
     */
    private refreshDomComputedStyle;
    /**
     * @description Refresh the CSS var keys
     */
    private refreshCssVarKeys;
    /**
     * @description Set CSS variable to the current DOM element
     *
     * @param {string} name
     * @param {string} value
     */
    private setDomVar;
    /**
     * @description Get CSS variable value by name
     * @param name
     */
    getVar(name: string): string | null;
    /**
     * @description Get an object of current CSS Vars
     */
    getVars(): {
        [key: string]: string;
    };
    /**
     * @description Set a CSS Variable by name and value
     *
     * @param {string} name - Name of CSS Variable (e.g. '--my-var')
     * @param {string} value - Value to set as the variable value
     */
    setVar(name: string, value: string): void;
    /**
     * @description Remove a single CSS variable by variable name
     * @param variable - Name of the Variable to remove
     */
    removeVar(variable: string): void;
    /**
     * @description Bulk add variables by an object of CSS Variables
     * @param {[key: string]: string} varsObj
     */
    addVars(varsObj: {
        [key: string]: string;
    }): void;
    /**
     * @description Set the current DOM element to get/set CSS vars to
     * @param domEl
     */
    setDomEl(domEl: HTMLElement): void;
    /**
     * @description Automatically add variables from a DOM Element
     */
    addVarsFromDomEl(): void;
    /**
     * @description Reset the css vars
     */
    resetVars(): void;
    /**
     * @description Refresh the CSS variables and assign values to the css_vars_obj.
     * NOTE: must be manually invoked, we can't watch for CSS var change events (yet)
     */
    update(): void;
}
export declare function extension(this: Core, options?: Options): CssVarsPlugin;
export {};
