$(window).on('load', () => handleGenColors())
$(window).on('load', () => loadProjects())
$('#gen-colors-btn').on('click', () => handleGenColors())
$('#save-palette-form').submit((e) => handlePaletteSubmit(e))
$('.colors-cont').on('click', '.color-box .color-details-cont .lock-btn', handleLockClick)
$('.create-project-form').submit((e) => handleProjectSubmit(e))
$('.projects-cont').on('click', '.small-palette-cont .palette .delete-palette-btn', handleDelete)
$('.projects-cont').on('click', '.small-palette-cont .palette .palette-name', handlePaletteClick)

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

const projNames = (() => {
  let projects = [];

  return {
    update: (newProj) => {
      projects = [...projects, newProj];
    },
    check: (name) => {
      return projects.includes(name);
    },
    get: () => {
      return projects;
    }
  }
})()

const appendOption = (projId, projName) => {
  $('#project-dropdown').append(`
    <option value=${projId}>${projName}</option>
  `)
}

const appendPalette = (palette) => {
  const {project_id, name, id} = palette;
  const swatches = genSwatchesHtml(palette); 

  $(`#proj-${project_id} .small-palette-cont`).append(`
    <div id=${id} class='palette'>
      <button class='palette-name'>${name}</button>
      <div class='small-colors-cont'>
        ${swatches.join('')}
      </div>
      <button class='delete-palette-btn'></button>
    </div>
  `)
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

const deletePalette = (paletteId) => {
  const id = {id: paletteId}
  console.log('palette id', id)

  fetch('/api/v1/palettes', {
    method: 'DELETE',
    body: JSON.stringify(id),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => console.log(res))
    .catch(err => {
      throw err
    })
}

const fetchPalette = async (paletteId) => {
  try {
    const response = await fetch(`/api/v1/palettes/${paletteId}`);

    return await response.json();
  } catch (error) {
    console.error(error)
  }
}

const fetchProjects = async () => {
  const response = await fetch('/api/v1/projects');
  const jsonResponse = await response.json();
  
  return jsonResponse
}

const fetchProjPalettes = async (projId) => {
  const palettes = await fetch(`/api/v1/projects/${projId}/palettes/`);

  return await palettes.json();
}

const genRandHex = () => {
  return '#'+Math.random().toString(16).slice(-6)
}

const genSwatchesHtml = (palette) => {
  let paletteColors = [];

  for (let i = 1; i <= 5; i++) {
    const hexCode = palette[`color_${i}`]
    const swatchHtml = (
      `<div class='small-palette-color' style='background-color: ${hexCode}'></div>`
    )
    
    paletteColors = [...paletteColors, swatchHtml];
  }

  return paletteColors;
}

const genPalettesHtml = async (projId) => {
  const jsonPalettes = await fetchProjPalettes(projId);

  if (jsonPalettes.error) {
    return [];
  }

  const htmlPalettes = jsonPalettes.map((palette) => {
    const { name, id } = palette;
    const swatches = genSwatchesHtml(palette);

    return (`
      <div id=${id} class='palette'>
        <button class='palette-name'>${name}</button>
        <div class='small-colors-cont'>
          ${swatches.join('')}
        </div>
        <button class='delete-palette-btn'></button>
      </div>
    `)
  })

  return htmlPalettes;
}

const getHexCodes = () => {
  let hexCodes = {};

  for (let i = 1; i <= 5; i++) {
    const hexCode = $(`#color-box-${i}-hex`).text();

    hexCodes = {...hexCodes, [`color_${i}`]: hexCode};
  }

  return hexCodes;
}

function handleDelete() {
  const paletteId = this.closest('.palette').id;

  this.closest('.palette').remove();
  deletePalette(paletteId);
}

const handleGenColors = () => {
  const unlockedColors = colorBoxes.getUnlockedColors();

  unlockedColors.forEach((color) => {
    const hexCode = genRandHex();

    $(`#${color}`).css('background-color', hexCode);
    $(`#${color}-hex`).text(hexCode.toUpperCase());
  })
}

async function handlePaletteClick() {
  const paletteId = this.closest('.palette').id;
  const palette = await fetchPalette(paletteId);
  updateColorBoxes(palette[0]);
}

const handlePaletteSubmit = (e) => {
  e.preventDefault()
  const projName = $('select').val()
  const paletteName = $('#palette-input').val();
  const hexCodes = getHexCodes();
  const newPalette = {...hexCodes, name: paletteName, project_id: parseInt(projName)};

  postPalette(newPalette);

  $('#palette-input').val('');
}

const handleProjectSubmit = (e) => {
  e.preventDefault();
  const projName = $('#project-name-input').val();
  const isDuplicated = projNames.check(projName);

  if (isDuplicated) {
    $('.alert').text('Choose another name. There\'s a project with that name already!')
  } else {
    const newProj = { name: projName }
    
    $('.alert').text('')
    projNames.update(name);
    postProject(newProj);
  }
}

function handleLockClick() {
  const btnId = this.id;

  toggleLock.call(this);
  toggleLockIcon(btnId);
}

const loadProjects = async () => {
  const projects = await fetchProjects();

  projects.forEach((project) => {
    const { id, name } = project;
    
    projNames.update(name);
    appendProject(project);
    appendOption(id, name);
  })
}

const postPalette = (palette) => {
  fetch('/api/v1/palettes/', {
    method: 'POST',
    body: JSON.stringify(palette),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(res => res.json())
  .catch(err => console.error(err))
  .then(res => {
    console.log(res);
    appendPalette(res);
  })
}

const postProject = (proj) => {
  fetch('/api/v1/projects/', {
    method: 'POST',
    body: JSON.stringify(proj),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(res => res.json())
  .catch(err => console.error(err))
  .then(res => {
    const {id, name} = res;
    appendProject(res);
    appendOption(id, name);
  });
}

function toggleLock() {
  const colorBoxId = this.closest('.color-box').id;

  colorBoxes.updateColors(colorBoxId);
}

const toggleLockIcon = (btnId) => {
  $(`#${btnId}`).toggleClass('locked')
}

const updateColorBoxes = (palette) => {
  const unlockedColors = colorBoxes.getUnlockedColors();

  unlockedColors.forEach((color, index) => {
    const hexCode = palette[`color_${index + 1}`]

    $(`#${color}`).css('background-color', hexCode);
    $(`#${color}-hex`).text(hexCode.toUpperCase());
  })
}










