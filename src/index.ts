import { extension } from './core'
export { extension } from './core'
export * from './core'
export { default as CssVarsPlugin } from './core'
export * from './core'

export default function register(
  cytoscape: (
    type: 'core' | 'collection' | 'layout',
    name: string,
    extension: any
  ) => void
) {
  cytoscape('core', 'cssVars', extension)
}

// Automatically register the extension for browser
declare global {
  interface Window {
    cytoscape?: any
  }
}
if (typeof window.cytoscape !== 'undefined') {
  register(window.cytoscape)
}

// Extend cytoscape.Core
export declare namespace cytoscape {
  type Ext2 = (
    cytoscape: (
      type: 'core' | 'collection' | 'layout',
      name: string,
      extension: any
    ) => void
  ) => void
  function use(module: Ext2): void

  interface Core {
    cssVars: any
  }
}
