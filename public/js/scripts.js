$(window).on('load', handleGenColors)
$('#gen-colors-btn').on('click', handleGenColors)
$('.colors-cont').on('click', '.color-box .color-details-cont .lock-btn', toggleLock)

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

function handleGenColors() {
  const unlockedColors = colorBoxes.getUnlockedColors();

  unlockedColors.forEach((color) => {
    const hexCode = genRandHex()

    $(`#${color}`).css('background-color', hexCode);
    $(`#${color}-hex`).text(hexCode);
  })
}

function genRandHex() {
  return '#'+Math.random().toString(16).slice(-6)
}

function toggleLock() {
  const colorBoxId = this.closest('.color-box').id;

  colorBoxes.updateColors(colorBoxId)
}