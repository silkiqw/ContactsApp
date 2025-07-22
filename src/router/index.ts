import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import ContactList from '../views/ContactList.vue';
import ContactDetails from '../views/ContactDetails.vue';
import ContactForm from '../views/ContactForm.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/contacts'
  },
  {
    path: '/contacts',
    name: 'ContactList',
    component: ContactList
  },
  {
    path: '/contact/:id',
    name: 'ContactDetails',
    component: ContactDetails,
    props: true
  },
  {
    path: '/contact-form/:id?',
    name: 'ContactForm',
    component: ContactForm,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router