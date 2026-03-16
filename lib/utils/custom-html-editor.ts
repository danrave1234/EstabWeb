export type CustomHtmlTextKind = "heading" | "paragraph" | "list" | "button" | "link" | "text"

export interface CustomHtmlTextField {
  index: number
  kind: CustomHtmlTextKind
  label: string
  value: string
  maxLength: number
}

export interface CustomHtmlImageField {
  index: number
  label: string
  src: string
  alt: string
}

export interface CustomHtmlLinkField {
  index: number
  label: string
  href: string
}

export interface CustomHtmlEditableContent {
  textFields: CustomHtmlTextField[]
  imageFields: CustomHtmlImageField[]
  linkFields: CustomHtmlLinkField[]
}

export interface CustomHtmlPatch {
  text?: Record<number, string>
  images?: Record<number, { src?: string; alt?: string }>
  links?: Record<number, string>
}

const GENERIC_SECTION_TITLES = new Set([
  "ai custom section",
  "custom section",
  "custom html section",
])

const TEXT_MAX_LENGTH: Record<CustomHtmlTextKind, number> = {
  heading: 120,
  paragraph: 700,
  list: 240,
  button: 70,
  link: 120,
  text: 240,
}

const ELLIPSIS = "..."

function toTitleCase(value: string): string {
  if (!value) return value
  return value.slice(0, 1).toUpperCase() + value.slice(1)
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function canUseDomParser(): boolean {
  return typeof window !== "undefined" && typeof window.DOMParser !== "undefined"
}

function parseHtmlFragment(html?: string): HTMLElement | null {
  if (!canUseDomParser() || !html?.trim()) return null
  const parser = new window.DOMParser()
  const doc = parser.parseFromString(`<div id="custom-html-root">${html}</div>`, "text/html")
  return doc.getElementById("custom-html-root")
}

function detectTextKind(tagName: string): CustomHtmlTextKind {
  if (/^h[1-6]$/.test(tagName)) return "heading"
  if (tagName === "p") return "paragraph"
  if (tagName === "li") return "list"
  if (tagName === "button") return "button"
  if (tagName === "a") return "link"
  return "text"
}

function textKindLabel(kind: CustomHtmlTextKind): string {
  switch (kind) {
    case "heading":
      return "Heading"
    case "paragraph":
      return "Paragraph"
    case "list":
      return "List Item"
    case "button":
      return "Button Text"
    case "link":
      return "Link Text"
    default:
      return "Text"
  }
}

function collectEditableTextNodes(root: HTMLElement): Text[] {
  const doc = root.ownerDocument
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  let current: Node | null = walker.nextNode()
  while (current) {
    const textNode = current as Text
    const parent = textNode.parentElement
    const normalized = normalizeText(textNode.nodeValue ?? "")
    if (
      parent &&
      normalized &&
      /[A-Za-z0-9]/.test(normalized) &&
      !["script", "style", "noscript"].includes(parent.tagName.toLowerCase())
    ) {
      nodes.push(textNode)
    }
    current = walker.nextNode()
  }
  return nodes
}

function trimTitle(value: string, max = 60): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - ELLIPSIS.length).trimEnd()}${ELLIPSIS}`
}

function extractContentTitleFromHtml(html?: string): string | null {
  const root = parseHtmlFragment(html)
  if (!root) return null

  const heading = root.querySelector("h1, h2, h3, h4, h5, h6")
  const headingText = normalizeText(heading?.textContent ?? "")
  if (headingText) return trimTitle(headingText)

  const firstTextNode = collectEditableTextNodes(root)[0]
  const firstText = normalizeText(firstTextNode?.nodeValue ?? "")
  if (firstText) return trimTitle(firstText)

  return null
}

export function getCustomHtmlSectionTitle(customHtml: Record<string, unknown> | null | undefined): string {
  const explicitTitle = normalizeText(String(customHtml?.title ?? ""))
  const normalizedTitle = explicitTitle.toLowerCase()
  if (explicitTitle && !GENERIC_SECTION_TITLES.has(normalizedTitle)) {
    return trimTitle(explicitTitle)
  }

  const htmlTitle = extractContentTitleFromHtml(String(customHtml?.html ?? ""))
  if (htmlTitle) return htmlTitle

  return "Custom Section"
}

export function extractCustomHtmlEditableContent(html?: string): CustomHtmlEditableContent {
  const root = parseHtmlFragment(html)
  if (!root) {
    return {
      textFields: [],
      imageFields: [],
      linkFields: [],
    }
  }

  const textCounters: Record<CustomHtmlTextKind, number> = {
    heading: 0,
    paragraph: 0,
    list: 0,
    button: 0,
    link: 0,
    text: 0,
  }

  const textFields = collectEditableTextNodes(root)
    .slice(0, 40)
    .map((node, index) => {
      const tagName = node.parentElement?.tagName.toLowerCase() ?? "span"
      const kind = detectTextKind(tagName)
      textCounters[kind] += 1
      const label = `${textKindLabel(kind)} ${textCounters[kind]}`
      return {
        index,
        kind,
        label,
        value: normalizeText(node.nodeValue ?? ""),
        maxLength: TEXT_MAX_LENGTH[kind],
      } satisfies CustomHtmlTextField
    })

  const imageFields = Array.from(root.querySelectorAll("img"))
    .slice(0, 20)
    .map((img, index) => ({
      index,
      label: `Image ${index + 1}`,
      src: img.getAttribute("src") ?? "",
      alt: img.getAttribute("alt") ?? "",
    }))

  const linkFields = Array.from(root.querySelectorAll("a[href]"))
    .slice(0, 20)
    .map((link, index) => ({
      index,
      label: `Link ${index + 1}`,
      href: link.getAttribute("href") ?? "",
    }))

  return {
    textFields,
    imageFields,
    linkFields,
  }
}

function preserveNodeSpacing(original: string, next: string): string {
  const leading = original.match(/^\s*/)?.[0] ?? ""
  const trailing = original.match(/\s*$/)?.[0] ?? ""
  return `${leading}${next}${trailing}`
}

export function applyCustomHtmlPatch(html: string | undefined, patch: CustomHtmlPatch): string {
  if (!patch || !html?.trim()) return html ?? ""
  const root = parseHtmlFragment(html)
  if (!root) return html ?? ""

  if (patch.text && Object.keys(patch.text).length > 0) {
    const textNodes = collectEditableTextNodes(root)
    Object.entries(patch.text).forEach(([indexStr, value]) => {
      const index = Number(indexStr)
      if (!Number.isInteger(index) || index < 0 || index >= textNodes.length) return
      const node = textNodes[index]
      const nextValue = String(value ?? "")
      node.nodeValue = preserveNodeSpacing(node.nodeValue ?? "", nextValue)
    })
  }

  if (patch.images && Object.keys(patch.images).length > 0) {
    const imageNodes = Array.from(root.querySelectorAll("img"))
    Object.entries(patch.images).forEach(([indexStr, value]) => {
      const index = Number(indexStr)
      if (!Number.isInteger(index) || index < 0 || index >= imageNodes.length) return
      const image = imageNodes[index]
      if (typeof value?.src === "string") {
        image.setAttribute("src", value.src)
      }
      if (typeof value?.alt === "string") {
        image.setAttribute("alt", value.alt)
      }
    })
  }

  if (patch.links && Object.keys(patch.links).length > 0) {
    const linkNodes = Array.from(root.querySelectorAll("a[href]"))
    Object.entries(patch.links).forEach(([indexStr, href]) => {
      const index = Number(indexStr)
      if (!Number.isInteger(index) || index < 0 || index >= linkNodes.length) return
      linkNodes[index].setAttribute("href", href)
    })
  }

  return root.innerHTML
}

export function formatCustomHtmlSectionChip(customHtml: Record<string, unknown> | null | undefined): string {
  const title = getCustomHtmlSectionTitle(customHtml)
  return toTitleCase(title)
}
