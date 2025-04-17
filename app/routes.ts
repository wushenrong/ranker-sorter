import type { RouteConfig } from '@react-router/dev/routes'
import { index, route } from '@react-router/dev/routes'

export default [
  index('routes/creator.tsx'),
  route('/ranker', 'routes/ranker.tsx'),
  route('/results', 'routes/results.tsx'),
] satisfies RouteConfig
