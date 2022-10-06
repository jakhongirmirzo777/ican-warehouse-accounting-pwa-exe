import { useRouter, useRoute } from 'vue-router'
import { $deepEquals } from '@/utils/pure-functions'

export function useQuery() {
  const route = useRoute()
  const router = useRouter()

  const getQuery = (model: string[]) => {
    const queries = route.query as Record<string, string>
    return model.reduce((acc: Record<string, string>, cur) => {
      if (queries[cur]) acc[cur] = queries[cur]
      return acc
    }, {})
  }

  const addQuery = (queries: Record<string, any>) => {
    const allQueries = {
      ...route.query,
      ...queries,
    }
    if ($deepEquals(allQueries, route.query)) return
    const filteredQueries = Object.entries(allQueries).reduce(
      (acc: Record<string, string | number>, [key, val]) => {
        if (val || val === 0) acc[key] = val as string
        return acc
      },
      {}
    )
    router.replace({ query: filteredQueries }).then()
  }

  const clearQuery = (model: string[]) => {
    const queries = route.query as Record<string, string>
    const rightQueries = model.reduce((acc: Record<string, string>, cur) => {
      if (queries[cur]) acc[cur] = queries[cur]
      return acc
    }, {})
    router.replace({ query: rightQueries }).then()
  }

  return {
    getQuery,
    addQuery,
    clearQuery,
  }
}
