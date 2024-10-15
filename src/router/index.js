import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "../pages/MainPage.vue";
import LoginPage from "../pages/(1)LoginPage.vue";
import ControlPanel from "../pages/(2-3-4)ControlPanel.vue";
import LocalizationsPage from "../pages/(5)LocalizationsPage.vue";
import SchedulePage from "../pages/(6)SchedulePage.vue";
import EditSchedulePage from "../pages/(7)EditSchedulePage.vue";
import EditMember from "../pages/(8)EditMember.vue";
import AddMember from "../pages/(9)AddMember.vue";
import MembersPage from "../pages/(10)MembersPage.vue";
import Chat from "../pages/(11)✖️ChatPage.vue";
import AddSchedulePage from "../pages/(12)AddSchedulePage.vue";
import Informes from "../pages/(13)ReportPage.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: LoginPage
    },
    {
        path: '/main',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/controlpanel',
        name: 'ControlPanel',
        component: ControlPanel
    },
    {
        path: '/localizations',
        name: 'Localizaciones',
        component: LocalizationsPage
    },
    {
        path: '/schedule',
        name: 'SchedulePage',
        component: SchedulePage
    },
    {
        path: '/schedule/edit',
        name: 'EditSchedulePage',
        component: EditSchedulePage
    },
    {
        path: '/editmember',
        name: 'EditMember',
        component: EditMember
    },
    {
        path: '/addmember',
        name: 'AddMember',
        component: AddMember
    },
    {
        path: '/members',
        name: 'MembersPage',
        component: MembersPage
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat
    },
    {
        path: '/addschedule',
        name: 'AddSchedule',
        component: AddSchedulePage
    },
    {
        path: '/informes',
        name: 'Informes',
        component: Informes
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
