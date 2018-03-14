$(window).on('load', () => handleGenColors())
$(window).on('load', () => loadProjects())
$('#gen-colors-btn').on('click', () => handleGenColors())
$('.colors-cont').on('click', '.color-box .color-details-cont .lock-btn', handleLockClick)

const colorBoxes = (() => {
  let boxIds = ['color-box-1', 'color-box-2', 'color-box-3', 'color-box-4', 'color-box-5'];

  return {
    updateColors: (boxId) => {
      const isDuplicated = boxIds.some(box => box === boxId);
      
      if (isDuplicated) {
        boxIds = boxIds.filter(box => box !== boxId);
      } else {
        boxIds = [...boxIds, boxId]
      }
    },
    getUnlockedColors: () => {
      return boxIds;
    }
  }
})()

const handleGenColors = () => {
  const unlockedColors = colorBoxes.getUnlockedColors();

  unlockedColors.forEach((color) => {
    const hexCode = genRandHex()

    $(`#${color}`).css('background-color', hexCode);
    $(`#${color}-hex`).text(hexCode.toUpperCase());
  })
}

const genRandHex = () => {
  return '#'+Math.random().toString(16).slice(-6)
}

function handleLockClick() {
  const btnId = this.id;
  console.log('id', btnId)
  toggleLock.call(this)
  toggleLockIcon(btnId)
}

function toggleLock() {
  const colorBoxId = this.closest('.color-box').id;

  colorBoxes.updateColors(colorBoxId)
}

const toggleLockIcon = (btnId) => {
  $(`#${btnId}`).toggleClass('locked')
}

const loadProjects = async () => {
  const projects = await fetchProjects();

  projects.forEach((project) => {
    const { id, name } = project;

    appendProject(project)
    appendOption(id, name)
  })
}

const fetchProjects = async () => {
  const response = await fetch('/api/v1/projects');
  const jsonResponse = await response.json();
  
  return jsonResponse
}

const appendProject = async (project) => {
  const { name, id } = project;
  const palettes = await genPalettesHtml(id);

  $('.projects-cont').append(`
    <article id='proj-${id}' class='project-cont'>
      <h3>${name}</h3>
      <div class='small-palette-cont'>
        ${palettes.join('')}
      </div>
    </article>
  `)
}

const genSwatchesHtml = (palette) => {
  let paletteColors = [];

  for (let i = 1; i <= 5; i++) {
    const hexCode = palette[`color_${i}`]
    const swatchHtml = (
      `<div class='small-palette-color' style='background-color: ${hexCode}'></div>`
    )
    
    paletteColors = [...paletteColors, swatchHtml]
  }

  return paletteColors;
}

const genPalettesHtml = async (projId) => {
  const jsonPalettes = await fetchProjPalettes(projId);
  const htmlPalettes = jsonPalettes.map((palette) => {
    const { name, id } = palette;
    const swatches = genSwatchesHtml(palette);

    return (`
      <button>${name}</button>
      <div class='small-colors-cont'>
        ${swatches.join('')}
      </div>
      <button class='delete-palette-btn'>Delete Me</button>
    `)
  })

  return htmlPalettes;
}

const fetchProjPalettes = async (projId) => {
  const palettes = await fetch(`/api/v1/projects/${projId}/palettes/`);

  return await palettes.json();
}

const appendOption = (projId, projName) => {
  $('#project-dropdown').append(`
    <option value=${projId}>${projName}</option>
  `)
}


