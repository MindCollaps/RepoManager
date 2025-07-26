import UsersDashboard from '~/components/dashboard/UsersDashboard.vue';
import GroupDashboard from '~/components/dashboard/GroupDashboard.vue';
import TokenDashboard from '~/components/dashboard/TokenDashboard.vue';
import UserIcon from '~/assets/icons/user.svg?component';
import GroupIcon from '~/assets/icons/group.svg?component';
import KeyIcon from '~/assets/icons/key.svg?component';

export interface DashboardPage {
    title: string;
    content: Component;
    icon?: Component;
}

export const useDashboard = () => computed<DashboardPage[]>(() => {
    const dashboard: DashboardPage[] = [
        {
            title: 'Groups',
            content: GroupDashboard,
            icon: GroupIcon,
        },
        {
            title: 'Group Invites',
            content: TokenDashboard,
            icon: KeyIcon,
        },
        {
            title: 'Users',
            content: UsersDashboard,
            icon: UserIcon,
        },
    ];

    return dashboard;
});
