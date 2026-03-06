/**
 * Single source of truth for section key → config property name mapping.
 * Re-exports from applyOperations so both the executor and the AI summary builder
 * always use the same map.
 */
export { resolveConfigProp as getSectionKey, SECTION_KEY_TO_CONFIG_PROP } from "@/lib/utils/applyOperations"
