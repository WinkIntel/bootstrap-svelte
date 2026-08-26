export type RouteType = {
    section: string;
    items: {
        label: string;
        href: string;
        title?: string;
        description?: string;
    }[];
};
