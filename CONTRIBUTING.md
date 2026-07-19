# Contributing to StadiumPulse AI

Keep changes small and role-focused. Components use PascalCase; functions, variables, and event handlers use camelCase. Shared visual shells belong in `src/components`, cross-role state lives in `src/context`, deterministic simulation and Gemini wrappers live in `src/lib`, and role experiences remain in `src/pages`.

Use functional React components, JSDoc typedefs for component props, stable data keys, `useMemo` for derived display data, and `useCallback` for handlers passed to repeated child elements. Preserve the existing Tailwind design tokens and run `npm run lint`, `npm test`, and `npm run build` before submitting.
