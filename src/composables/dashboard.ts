import UsersDashboard from '~/components/dashboard/UsersDashboard.vue';
import GroupDashboard from '~/components/dashboard/GroupDashboard.vue';

export interface DashboardPage {
    title: string;
    content: Component;
}

export const useDashboard = () => computed<DashboardPage[]>(() => {
    const dashboard: DashboardPage[] = [
        {
            title: 'Users',
            content: UsersDashboard,
        },
        {
            title: 'Groups',
            content: GroupDashboard,
        },
    ];

    return dashboard;
});
