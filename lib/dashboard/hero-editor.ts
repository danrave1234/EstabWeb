/**
 * Home-page hero visibility in the site editor.
 * One hero block id may appear in activeSections (e.g. hero, hero--showcase).
 * When hidden, we keep the last variant id so unhide restores the same design.
 */

export function isHeroSectionId(id: string): boolean {
  return id === "hero" || id.startsWith("hero")
}

export function findHeroInActiveSections(
  activeSections: string[]
): { index: number; id: string } | null {
  const index = activeSections.findIndex(isHeroSectionId)
  if (index < 0) return null
  return { index, id: activeSections[index]! }
}

/**
 * Which hero id the editor should use for labels / restore when the hero is not on the page.
 */
export function resolveHeroEditorId(
  activeSections: string[],
  selectedSection: string | null,
  storedWhenHidden: string
): string {
  const found = findHeroInActiveSections(activeSections)
  if (found) return found.id
  if (selectedSection && isHeroSectionId(selectedSection)) return selectedSection
  return storedWhenHidden || "hero"
}

export function isHeroRowSelected(
  resolvedHeroId: string,
  heroIndex: number,
  selectedSection: string | null
): boolean {
  if (selectedSection === resolvedHeroId) return true
  if (heroIndex < 0 && selectedSection && isHeroSectionId(selectedSection)) return true
  return false
}

/** API returned from `useEditorState` for home hero visibility + sidebar row. */
export interface HeroEditorApi {
  resolvedHeroId: string
  heroIndex: number
  isVisible: boolean
  selectInEditor: () => void
  showOnPage: () => void
  hideFromPage: () => void
  toggleVisibility: () => void
}
