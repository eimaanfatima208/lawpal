import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Syncs dashboard sub-pages with ?tab= in the URL so refresh keeps the same view.
 */
export function useTabNavigation(validPages, defaultPage = 'dashboard') {
  const location = useLocation()
  const navigate = useNavigate()

  const tabParam = new URLSearchParams(location.search).get('tab')
  const activePage =
    tabParam && validPages.includes(tabParam) ? tabParam : defaultPage

  const setActivePage = (page) => {
    const next =
      page && validPages.includes(page) ? page : defaultPage
    const params = new URLSearchParams()
    if (next !== defaultPage) {
      params.set('tab', next)
    }
    const search = params.toString()
    navigate({
      pathname: location.pathname,
      search: search ? `?${search}` : '',
    })
  }

  return [activePage, setActivePage]
}
