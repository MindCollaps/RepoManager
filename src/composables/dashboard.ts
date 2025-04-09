import UsersDashboard from '~/components/dashboard/UsersDashboard.vue';
import GroupDashboard from '~/components/dashboard/GroupDashboard.vue';
import UserIcon from '~/assets/icons/user.svg?component';
import GroupIcon from '~/assets/icons/group.svg?component';

export interface DashboardPage {
    title: string;
    content: Component;
    icon?: Component;
}

export const useDashboard = () => computed<DashboardPage[]>(() => {
    const dashboard: DashboardPage[] = [
        {
            title: 'Users',
            content: UsersDashboard,
            icon: UserIcon,
        },
        {
            title: 'Groups',
            content: GroupDashboard,
            icon: GroupIcon,
        },
    ];

    return dashboard;
});
