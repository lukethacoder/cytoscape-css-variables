export default function register(cytoscape: (type: 'core' | 'collection' | 'layout', name: string, extension: any) => void): void;
declare global {
    interface Window {
        cytoscape?: any;
    }
}
export declare namespace cytoscape {
    type Ext2 = (cytoscape: (type: 'core' | 'collection' | 'layout', name: string, extension: any) => void) => void;
    function use(module: Ext2): void;
    interface Core {
        cssVars: any;
    }
}
