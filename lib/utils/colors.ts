import { COLOR_THEME_SWATCHES } from "@/config/dashboard-config";

export const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '').trim()
    if (h.length !== 6) return null
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
    return { r, g, b }
}

export const rgbToHsl = (r: number, g: number, b: number) => {
    const rn = r / 255
    const gn = g / 255
    const bn = b / 255
    const max = Math.max(rn, gn, bn)
    const min = Math.min(rn, gn, bn)
    const d = max - min
    const l = (max + min) / 2
    if (d === 0) return { h: 0, s: 0, l }
    const s = d / (1 - Math.abs(2 * l - 1))
    let h = 0
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
    return { h, s, l }
}

export const tagForHex = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return [] as string[]
    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const tags: string[] = []
    if (s < 0.12) tags.push('neutral')
    if (l < 0.18) tags.push('dark')
    if (l > 0.85) tags.push('light')
    if (s >= 0.12) {
        if (h >= 200 && h < 260) tags.push('blue')
        else if (h >= 260 && h < 315) tags.push('purple')
        else if (h >= 315 || h < 15) tags.push('red')
        else if (h >= 15 && h < 45) tags.push('orange')
        else if (h >= 45 && h < 75) tags.push('yellow')
        else if (h >= 75 && h < 160) tags.push('green')
        else if (h >= 160 && h < 200) tags.push('teal')
    }
    return tags
}

export const getPaletteEntries = () => {
    return Object.keys(COLOR_THEME_SWATCHES).map((key) => {
        const swatches = COLOR_THEME_SWATCHES[key] || COLOR_THEME_SWATCHES.partner
        const nameTags = key.split(/[-_\s]+/g).filter(Boolean).map((t) => t.toLowerCase())
        const colorTags = Array.from(new Set(swatches.flatMap((hex) => tagForHex(hex))))
        const tags = Array.from(new Set([...nameTags, ...colorTags]))
        return { key, swatches, tags }
    })
}
