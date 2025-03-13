import HomeIcon from 'assets/icons/home.svg?component';

export interface HeaderItem {
    text: string;
    active?: boolean;
    action?: () => any;
    path?: string;
    disabled?: boolean;
    hide?: boolean;
    width?: string;
    icon?: Component;
    children?: Omit<HeaderItem, 'children' | 'minWidth'>[];
}

export const useHeaderMenu = () => computed<HeaderItem[]>(() => {
    const route = useRoute();

    const menu: HeaderItem[] = [
        {
            text: 'home',
            path: '/',
            icon: HomeIcon,
        },
    ];

    return menu.filter(x => !x.hide).map(x => {
        return {
            ...x,
            active: x.active ?? (x.path === route.path || !!x.children?.some(x => x.path === route.path)),
            children: x.children && x.children.map(x => ({
                ...x,
                active: x.active ?? x.path === route.path,
            })),
        } satisfies HeaderItem as HeaderItem;
    });
});
