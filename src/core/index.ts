import { Core, EventObject } from 'cytoscape'

let cy

let css_vars_obj: { [key: string]: string }
let css_variables = Object.keys(css_vars_obj)

type Activator = (evt: EventObject) => boolean

interface Options {
  threshold?: number
  activators?: Activator[]
}

const defaultThreshold = 5

const defaultActivators: Activator[] = [
  (evt) => {
    if (evt.originalEvent instanceof MouseEvent) {
      return evt.originalEvent.button === 0
    } else if (evt.originalEvent instanceof TouchEvent) {
      return evt.originalEvent.touches.length === 1
    }
    return false
  },
]

/**
 * @description Refresh the CSS variables and assign values to the css_vars_obj.
 * NOTE: must be manually invoked, we can't watch for CSS var change events (yet)
 */
function refreshCssVars() {
  const bodyCss = getComputedStyle(document.body)

  css_variables.forEach(
    (css_var) => (css_vars_obj[css_var] = bodyCss.getPropertyValue(css_var))
  )

  cy.startBatch()
  cy.elements('*').data({})
  cy.endBatch()
}

export default function extension(this: Core, options: Options = {}): Core {
  let cy = this
  console.log('cy ', cy)

  const threshold = options.threshold || defaultThreshold
  const activators = options.activators || defaultActivators
  // const userPanningEnabled = this.userPanningEnabled()
  // const boxSelectionEnabled = this.boxSelectionEnabled()
  // let hasPanStarted = false
  // let startEvent: null | EventObject

  // function assignCssVarsToCanvas() {
  //   let _nodes = cy.nodes()
  //   console.debug('_nodes ', _nodes)
  //   _nodes.forEach((node) => {
  //     const nodesToCheck = []
  //     const style_obj = node.style()
  //     console.log(style_obj)
  //     console.log('background-color', style_obj['background-color'])
  //     Object.values(style_obj).forEach((style_val, key) => {
  //       if (style_val.includes('var(')) {
  //         nodesToCheck.push(key)
  //       }
  //     })
  //     console.log('nodesToCheck ', nodesToCheck)
  //   })
  // }

  this.getVar = (variable) => css_vars_obj[variable]

  this.setVar = (variable, value, elRef) => {
    css_vars_obj[variable] = value
    elRef.style.setProperty(variable, value)
  }

  this.refresh = refreshCssVars()

  console.debug('cssVars ', this)
  console.debug('options ', options)

  this.one('render', (e: any) => {
    console.debug('render ', e)
    // assignCssVarsToCanvas()
  })

  this.on('style', (e) => {
    console.warn('styling this element here ', e)
  })

  // this.on('vmousedown', (evt: EventObject) => {
  //   if (activators.some((activator) => activator(evt))) {
  //     startEvent = evt
  //   }
  // })
  // this.on('vmouseup', (evt: EventObject) => {
  //   if (hasPanStarted) {
  //     this.emit('awpanend', [evt])
  //     this.userPanningEnabled(userPanningEnabled)
  //     this.boxSelectionEnabled(boxSelectionEnabled)
  //   }
  //   startEvent = null
  //   hasPanStarted = false
  // })
  // this.on('vmousemove', (evt: EventObject) => {
  //   if (!startEvent) {
  //     return
  //   }
  //   const startPosition = startEvent.position
  //   const deltaX = evt.position.x - startPosition.x
  //   const deltaY = evt.position.y - startPosition.y
  //   if (!hasPanStarted) {
  //     if (Math.sqrt(deltaX ** 2 + deltaY ** 2) < threshold) {
  //       return
  //     }
  //     this.emit('awpanstart', [startEvent])
  //     hasPanStarted = true
  //     // Disable user panning and box selection only on non touch device
  //     if (startEvent.originalEvent instanceof MouseEvent) {
  //       this.userPanningEnabled(false)
  //       this.boxSelectionEnabled(false)
  //     }
  //   }
  //   const zoom = this.zoom()
  //   this.panBy({
  //     x: deltaX * zoom,
  //     y: deltaY * zoom,
  //   })
  //   this.emit('awpanmove', [evt])
  // })

  return this
}
