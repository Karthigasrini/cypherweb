import CypherWeb from 'index';
import utils from 'utils';
import semver from 'semver';

export default class Plugin {

    constructor(cypherWeb = false, options = {}) {
        if (!cypherWeb || !cypherWeb instanceof CypherWeb)
            throw new Error('Expected instance of CypherWeb');
        this.cypherWeb = cypherWeb;
        this.pluginNoOverride = ['register'];
        this.disablePlugins = options.disablePlugins;
    }

    register(Plugin, options) {
        let pluginInterface = {
            requires: '0.0.0',
            components: {}
        }
        let result = {
            libs: [],
            plugged: [],
            skipped: []
        }
        if (this.disablePlugins) {
            result.error = 'This instance of CypherWeb has plugins disabled.'
            return result;
        }
        const plugin = new Plugin(this.cypherWeb)
        if (utils.isFunction(plugin.pluginInterface)) {
            pluginInterface = plugin.pluginInterface(options)
        }
        if (semver.satisfies(CypherWeb.version, pluginInterface.requires)) {
            if (pluginInterface.fullClass) {
                // plug the entire class at the same level of cypherWeb.cyp
                let className = plugin.constructor.name
                let classInstanceName = className.substring(0, 1).toLowerCase() + className.substring(1)
                if (className !== classInstanceName) {
                    CypherWeb[className] = Plugin
                    this.cypherWeb[classInstanceName] = plugin
                    result.libs.push(className)
                }
            } else {
                // plug methods into a class, like cyp
                for (let component in pluginInterface.components) {
                    if (!this.cypherWeb.hasOwnProperty(component)) {
                        continue
                    }
                    let methods = pluginInterface.components[component]
                    let pluginNoOverride = this.cypherWeb[component].pluginNoOverride || []
                    for (let method in methods) {
                        if (method === 'constructor' || (this.cypherWeb[component][method] &&
                            (pluginNoOverride.includes(method) // blacklisted methods
                                || /^_/.test(method)) // private methods
                        )) {
                            result.skipped.push(method)
                            continue
                        }
                        this.cypherWeb[component][method] = methods[method].bind(this.cypherWeb[component])
                        result.plugged.push(method)
                    }
                }
            }
        } else {
            throw new Error('The plugin is not compatible with this version of CypherWeb')
        }
        return result
    }
}

