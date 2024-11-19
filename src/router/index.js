import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "../pages/MainPage.vue";
import LoginPage from "../pages/Web/(1)LoginPage.vue";
import ControlPanel from "../pages/Web/(2-3-4)ControlPanel.vue";
import LocalizationsPage from "../pages/Web/(5)LocalizationsPage.vue";
import SchedulePage from "../pages/Web/(6)SchedulePage.vue";
import EditSchedulePage from "../pages/Web/(7)EditSchedulePage.vue";
import EditMember from "../pages/Web/(8)EditMember.vue";
import AddMember from "../pages/Web/(9)AddMember.vue";
import MembersPage from "../pages/Web/(10)MembersPage.vue";
import Chat from "../pages/Web/(11)ChatPage.vue";
import AddSchedulePage from "../pages/Web/(12)AddSchedulePage.vue";
import Informes from "../pages/Web/(13)ReportPage.vue";
import ChatComponent from "../components/ChatComponent.vue";
import NavBar from "../components/ForMobile/NavBar.vue";
import LoginPageMovil from "../pages/Mobile/(M1)LoginPage.vue";
import ControlPanelMovil from "../pages/Mobile/(M2)ControlPanel.vue";
import MobileSchedulePage from "../pages/Mobile/(M3)SchedulePage.vue";
import MobileChatPage from "../pages/Mobile/(M4)ChatPage.vue";
import MobileChatPage2 from "../pages/Mobile/(M5)ChatPage2.vue";
import MobileMenu from "../pages/Mobile/(M6)Menu.vue";
import ChatPage2 from "../pages/Mobile/(M5)ChatPage2.vue";
import RegisterPage from "../pages/Web/(1)RegisterPage.vue";

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
        path: '/edit-schedule/:id',
        name: 'EditSchedulePage',
        component: EditSchedulePage
    },
    {
        path: '/edit-member/:id',
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
        component: ChatComponent
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
    },
    {
        path: "/navbar",
        name: "Navbar",
        component: NavBar
    },
    {
        path:"/loginmovil",
        name:"LoginMovil",
        component: LoginPageMovil
    },
    {
        path: "/controlpanelmovil",
        name: "ControlPanelMovil",
        component: ControlPanelMovil
    },
    {
        path: "/schedulepagemobile",
        name: "SchedulePageMobile",
        component: MobileSchedulePage,
    },
    {
        path: "/chatpage",
        name:"ChatPage",
        component: MobileChatPage,
    },
    {
        path: "/menu",
        name: "Menu",
        component:MobileMenu
    },
    {
        path: '/chat/:userId',
        name: 'ChatPage2',
        component: ChatPage2
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
