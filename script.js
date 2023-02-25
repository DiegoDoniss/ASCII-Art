const inputFiles = document.getElementById('file')
const selector = document.getElementById('range')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const btnCopy = document.getElementById('copy')
const image = new Image()
const characters = `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^\`'. `
let strImage = ''
if (inputFiles.files.length > 0) {
    const reader = new FileReader()
    reader.readAsDataURL(inputFiles.files[0])
    reader.onload = () => {
        image.src = reader.result.toString()
        btnCopy.removeAttribute('hidden')
    }
}

image.onload = () => {
    const {width, height} = image
    canvas.width = width
    canvas.height = height
    printCanvas(selector.value, width, height)
}
inputFiles.addEventListener('change', (event) => {
    const reader = new FileReader()
    reader.readAsDataURL(inputFiles.files[0])
    reader.onload = () => {
        image.src = reader.result.toString()
    }
})
selector.addEventListener('change', () => {
    console.log(selector.value)
    if (inputFiles.files.length > 0) {
        printCanvas(selector.value, image.width, image.height)
        selector.value < 5
            ? btnCopy.setAttribute('hidden', 'true')
            : btnCopy.removeAttribute('hidden')
    }
})

function scanImage(pixelBlock, w, h) {
    let cell = []
    strImage = ''
    ctx.drawImage(image, 0, 0, w, h)
    const pixels = ctx.getImageData(0, 0, w, h)
    const data = pixels.data
    for (let y = 0; y < h; y += pixelBlock) {
        for (let x = 0; x < w; x += pixelBlock) {
            const posx = x * 4
            const posy = y * 4
            const pos = (posy * w) + posx
            if (data[pos + 3] > 128) {
                const red = data[pos]
                const green = data[pos + 1]
                const blue = data[pos + 2]
                const total = (red + green + blue)
                const averageColor = total/ 3
                const color = `rgb(${red},${green},${blue})`
                const symbol = total<750?getSymbol(averageColor):' '
                cell.push({x, y, color, symbol})
                strImage += symbol
            } else {
                strImage += ' '
            }
        }
        strImage += '\n'
    }
    return cell
}

function getSymbol(averageColor) {
    const pos = averageColor / characters.length
    return characters[Math.ceil(pos)]
}

function printCanvas(value, w, h) {
    const nValue = parseInt(value)
    ctx.width = w
    ctx.height = h
    const cellsAscii = scanImage(nValue, w, h)
    ctx.clearRect(0, 0, w, h)
    cellsAscii.forEach(({x, y, color, symbol}) => {
        ctx.fillStyle = color
        ctx.fillText(symbol, x, y)
    })
}

function onClick() {
    navigator.clipboard.writeText(strImage)
}
