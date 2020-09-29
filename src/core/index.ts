import { Core } from 'cytoscape'

interface Options {
  initialVars?: { [key: string]: string }
  domEl?: HTMLElement
}

declare global {
  interface Element {
    visible: () => boolean
  }
}

export default class CssVarsPlugin {
  readonly _cy: Core
  readonly _options: Options

  _domEl: HTMLElement | null = null
  _domElComputedStyle: CSSStyleDeclaration | null = null

  css_vars_obj: { [key: string]: string } = {}
  css_vars_keys: string[] = []

  constructor(cy: Core, options: Options = {}) {
    this._cy = cy
    this._options = options

    if (this._options.domEl) {
      this._domEl = this._options.domEl
      this.refreshDomComputedStyle()
    }

    if (this._options.initialVars) {
      this.addVars(this._options.initialVars)
    }
  }

  /**
   * @description Refresh the computed style of the current Dom Element
   */
  private refreshDomComputedStyle() {
    if (this._domEl) {
      this._domElComputedStyle = getComputedStyle(this._domEl)
    }
  }

  /**
   * @description Refresh the CSS var keys
   */
  private refreshCssVarKeys() {
    this.css_vars_keys = Object.keys(this.css_vars_obj)
  }

  /**
   * @description Set CSS variable to the current DOM element
   *
   * @param {string} name
   * @param {string} value
   */
  private setDomVar(name: string, value: string) {
    if (this._domEl) {
      this._domEl.style.setProperty(name, value)
      this.refreshDomComputedStyle()
    }
  }

  /**
   * @description Get CSS variable value by name
   * @param name
   */
  getVar(name: string) {
    if (this.css_vars_obj[name]) {
      return this.css_vars_obj[name]
    } else {
      return null
    }
  }

  /**
   * @description Get an object of current CSS Vars
   */
  getVars() {
    return this.css_vars_obj
  }

  /**
   * @description Set a CSS Variable by name and value
   *
   * @param {string} name - Name of CSS Variable (e.g. '--my-var')
   * @param {string} value - Value to set as the variable value
   */
  setVar(name: string, value: string) {
    let alreadyExists = this.css_vars_obj[name]

    this.css_vars_obj[name] = value

    this.setDomVar(name, value)

    if (!alreadyExists) {
      this.refreshCssVarKeys()
    }
  }

  /**
   * @description Remove a single CSS variable by variable name
   * @param variable - Name of the Variable to remove
   */
  removeVar(variable: string) {
    if (this.css_vars_obj[variable]) {
      delete this.css_vars_obj[variable]
    }
  }

  /**
   * @description Bulk add variables by an object of CSS Variables
   * @param {[key: string]: string} varsObj
   */
  addVars(varsObj: { [key: string]: string }) {
    Object.keys(varsObj).forEach((varsKey) => {
      this.css_vars_obj[varsKey] = varsObj[varsKey]
      this.setDomVar(varsKey, varsObj[varsKey])
    })
  }

  /**
   * @description Set the current DOM element to get/set CSS vars to
   * @param domEl
   */
  setDomEl(domEl: HTMLElement) {
    this._domEl = domEl
  }

  /**
   * @description Automatically add variables from a DOM Element
   */
  addVarsFromDomEl() {
    if (this._domEl) {
      // Loop over each defined css variable and get its value
      this.css_vars_keys.forEach(
        (css_var) =>
          (this.css_vars_obj[css_var] = this._domElComputedStyle
            ? this._domElComputedStyle.getPropertyValue(css_var)
            : this.css_vars_obj[css_var])
      )
    }
  }

  /**
   * @description Reset the css vars
   */
  resetVars() {
    this.css_vars_obj = {}
    this.css_vars_keys = []
  }

  /**
   * @description Refresh the CSS variables and assign values to the css_vars_obj.
   * NOTE: must be manually invoked, we can't watch for CSS var change events (yet)
   */
  update() {
    this._cy.startBatch()
    this._cy.elements('*').data({})
    this._cy.endBatch()
  }
}

export function extension(this: Core, options: Options = {}) {
  return new CssVarsPlugin(this, options)
}
