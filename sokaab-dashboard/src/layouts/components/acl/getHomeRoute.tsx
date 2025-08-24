/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'client') return '/vue'
  // else return '/dashboards/analytics'
  else return '/dashboard'
}

export default getHomeRoute
