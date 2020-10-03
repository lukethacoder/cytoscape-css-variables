let css_vars
let currentTheme = '--theme-primary'

const picker = document.querySelector('rgb-string-color-picker')
function initColorPicker() {
  // set initial color
  if (css_vars) {
    picker.color = css_vars.getVar(currentTheme)
  } else {
    picker.color = 'red'
  }

  // on even listener change, change the css vars
  // the cssVars extension then needs to know to re-calc the css var values here
  picker.addEventListener('color-changed', (event) => {
    const newColor = event.detail.value
    document.body.style.setProperty(currentTheme, newColor)

    if (css_vars) {
      css_vars.setVar(currentTheme, newColor)
      css_vars.update()
    }
  })
}

// not core functionality, just here for the demo
function initThemeSelector() {
  const radioWrapper = document.querySelector(`.radio--opts`)

  if (radioWrapper) {
    const themeInputs = radioWrapper.querySelectorAll('input')

    themeInputs.forEach((themeInput) => {
      themeInput.addEventListener('input', (e) => {
        currentTheme = `--theme-${e.target.value}`

        if (css_vars) {
          picker.color = css_vars.getVar(currentTheme)
        }
      })
    })
  }
}

function initSizeSlider() {
  const sizeSlider = document.querySelector('#size--slider')

  if (sizeSlider) {
    sizeSlider.addEventListener('change', (e) => {
      console.log('e ', e)
      console.log('e.target.value ', e.target.value)
      if (css_vars) {
        css_vars.setVar('--cy-node-size', e.target.value)
        css_vars.update()
      }
    })
  }
}

// Can't call css_vars before it is initiated, so abstracting the function here
const getVar = (variable) => (css_vars ? css_vars.getVar(variable) : null)

function initCytoscape() {
  var cy = (window.cy = cytoscape({
    container: document.getElementById('cy'),
    style: [
      {
        selector: 'node',
        style: {
          'background-color': () => getVar('--theme-primary'),
          width: () => getVar('--cy-node-size'),
          height: () => getVar('--cy-node-size'),
        },
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'line-color': () => getVar('--theme-tertiary'),
        },
      },
    ],
    elements: {
      nodes: [
        { data: { id: 'j', name: 'Jerry' } },
        { data: { id: 'e', name: 'Elaine' } },
        { data: { id: 'k', name: 'Kramer' } },
        { data: { id: 'g', name: 'George' } },
      ],
      edges: [
        { data: { source: 'j', target: 'e' } },
        { data: { source: 'j', target: 'k' } },
        { data: { source: 'j', target: 'g' } },
        { data: { source: 'e', target: 'j' } },
        { data: { source: 'e', target: 'k' } },
        { data: { source: 'k', target: 'j' } },
        { data: { source: 'k', target: 'e' } },
        { data: { source: 'k', target: 'g' } },
        { data: { source: 'g', target: 'j' } },
      ],
    },
  }))
  // demo your core ext
  /*
        cy.anywherePanning(
          function() {
            return panningModeElement.checked;
          },
          function(event) {
            if (event instanceof MouseEvent) {
              return event.button === 0;
            } else if (event instanceof TouchEvent) {
              return event.touches.length === 1;
            }
            return false;
          },
        );

        */

  console.log('cy ', cy)

  // Init CSS Vars
  css_vars = cy.cssVars({
    initialVars: {
      '--theme-primary': 'rgb(245, 204, 0)',
      '--theme-secondary': 'rgb(0, 8, 20)',
      '--theme-tertiary': 'rgb(234,84,85)',
      '--cy-node-size': 30,
    },
    domEl: document.body,
  })
  css_vars.update()

  initColorPicker()
  initThemeSelector()
  initSizeSlider()
}

document.addEventListener('DOMContentLoaded', function () {
  initCytoscape()
})
