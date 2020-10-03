var CssVarsPlugin = /** @class */ (function () {
    function CssVarsPlugin(cy, options) {
        if (options === void 0) { options = {}; }
        this._domEl = null;
        this._domElComputedStyle = null;
        this.css_vars_obj = {};
        this.css_vars_keys = [];
        this._cy = cy;
        this._options = options;
        if (this._options.domEl) {
            this._domEl = this._options.domEl;
            this.refreshDomComputedStyle();
        }
        if (this._options.initialVars) {
            this.addVars(this._options.initialVars);
        }
    }
    /**
     * @description Refresh the computed style of the current Dom Element
     */
    CssVarsPlugin.prototype.refreshDomComputedStyle = function () {
        if (this._domEl) {
            this._domElComputedStyle = getComputedStyle(this._domEl);
        }
    };
    /**
     * @description Refresh the CSS var keys
     */
    CssVarsPlugin.prototype.refreshCssVarKeys = function () {
        this.css_vars_keys = Object.keys(this.css_vars_obj);
    };
    /**
     * @description Set CSS variable to the current DOM element
     *
     * @param {string} name
     * @param {string} value
     */
    CssVarsPlugin.prototype.setDomVar = function (name, value) {
        if (this._domEl) {
            this._domEl.style.setProperty(name, value);
            this.refreshDomComputedStyle();
        }
    };
    /**
     * @description Get CSS variable value by name
     * @param name
     */
    CssVarsPlugin.prototype.getVar = function (name) {
        if (this.css_vars_obj[name]) {
            return this.css_vars_obj[name];
        }
        else {
            return null;
        }
    };
    /**
     * @description Get an object of current CSS Vars
     */
    CssVarsPlugin.prototype.getVars = function () {
        return this.css_vars_obj;
    };
    /**
     * @description Set a CSS Variable by name and value
     *
     * @param {string} name - Name of CSS Variable (e.g. '--my-var')
     * @param {string} value - Value to set as the variable value
     */
    CssVarsPlugin.prototype.setVar = function (name, value) {
        var alreadyExists = this.css_vars_obj[name];
        this.css_vars_obj[name] = value;
        this.setDomVar(name, value);
        if (!alreadyExists) {
            this.refreshCssVarKeys();
        }
    };
    /**
     * @description Remove a single CSS variable by variable name
     * @param variable - Name of the Variable to remove
     */
    CssVarsPlugin.prototype.removeVar = function (variable) {
        if (this.css_vars_obj[variable]) {
            delete this.css_vars_obj[variable];
        }
    };
    /**
     * @description Bulk add variables by an object of CSS Variables
     * @param {[key: string]: string} varsObj
     */
    CssVarsPlugin.prototype.addVars = function (varsObj) {
        var _this = this;
        Object.keys(varsObj).forEach(function (varsKey) {
            _this.css_vars_obj[varsKey] = varsObj[varsKey];
            _this.setDomVar(varsKey, varsObj[varsKey]);
        });
    };
    /**
     * @description Set the current DOM element to get/set CSS vars to
     * @param domEl
     */
    CssVarsPlugin.prototype.setDomEl = function (domEl) {
        this._domEl = domEl;
    };
    /**
     * @description Automatically add variables from a DOM Element
     */
    CssVarsPlugin.prototype.addVarsFromDomEl = function () {
        var _this = this;
        if (this._domEl) {
            // Loop over each defined css variable and get its value
            this.css_vars_keys.forEach(function (css_var) {
                return (_this.css_vars_obj[css_var] = _this._domElComputedStyle
                    ? _this._domElComputedStyle.getPropertyValue(css_var)
                    : _this.css_vars_obj[css_var]);
            });
        }
    };
    /**
     * @description Reset the css vars
     */
    CssVarsPlugin.prototype.resetVars = function () {
        this.css_vars_obj = {};
        this.css_vars_keys = [];
    };
    /**
     * @description Refresh the CSS variables and assign values to the css_vars_obj.
     * NOTE: must be manually invoked, we can't watch for CSS var change events (yet)
     */
    CssVarsPlugin.prototype.update = function () {
        this._cy.startBatch();
        this._cy.elements('*').data({});
        this._cy.endBatch();
    };
    return CssVarsPlugin;
}());
function extension(options) {
    if (options === void 0) { options = {}; }
    return new CssVarsPlugin(this, options);
}

function register(cytoscape) {
    if (!cytoscape) {
        console.warn('Unable to register cssVars extension');
        return;
    }
    cytoscape('core', 'cssVars', extension);
}
if (typeof window.cytoscape !== 'undefined') {
    register(window.cytoscape);
}

export default register;
//# sourceMappingURL=cytoscape-css-variables.esm.js.map
