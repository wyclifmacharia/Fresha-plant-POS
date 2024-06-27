import Login from '../components/user/Login.vue'
import OrdersList from '../components/orders/OrdersList.vue'
import NewOrder from '../components/orders/NewOrder.vue' 
import MainComponent from '@/components/MainComponent.vue'
import Users from '../components/user/Users.vue' 
 
export const routes = [
  {
    path: '/',
    name: 'index',
    component: Login,
    meta: {
      public: true
    }
  },
  {
    path: '/pos',
    name: 'Main',
    component: MainComponent,
    meta: {
      public: true
      // requiresAuth: true
    },
    children: [
      {
        path: '/pos/orders/new',
        name: 'new-order',
        component: NewOrder,
        meta: {
          public: true
          // requiresAuth: true
        }
      },
      {
        path: '/pos/orders/list',
        name: 'orders-list',
        component: OrdersList,
        meta: {
          public: true
          // requiresAuth: true
        }
      },
      {
        path: '/pos/users',
        name: 'users-list',
        component: Users,
        meta: {
          public: true
          // requiresAuth: true
        }
      },
    ]
  },


]
