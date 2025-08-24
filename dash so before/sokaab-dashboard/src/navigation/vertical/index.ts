// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'tabler:smart-home',

      // badgeContent: 'new',
      // badgeColor: 'error',
      path: '/dashboard'
    },
    {
      sectionTitle: 'Managements'
    },
    {
      title: 'Projects',
      icon: 'tabler:packages',
      path: '/projects'
    },
    {
      title: 'Updates',
      icon: 'tabler:rotate-rectangle',
      path: '/updates'
    },
    {
      title: 'Organisation',
      icon: 'tabler:affiliate',
      path: '/organisations'
    },
    // {
    //   title: 'Submissions',
    //   icon: 'tabler:browser-check',
    //   path: '/submissions'
    // },
    {
      title: 'Users',
      icon: 'tabler:users-group',
      path: '/users'
    },
    {
      sectionTitle: 'Others'
    },
    {
      title: 'Contacts',
      icon: 'tabler:address-book',
      path: '/contacts'
    }
  ]
}

export default navigation
