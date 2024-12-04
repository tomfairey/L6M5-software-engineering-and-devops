import type { ReactNode } from "react";

export interface NavigationProps {
    items: NavigationItem[];
    currentRoute: string;
}

export interface NavigationItem {
    title: string;
    href: string;
    icon: ReactNode;
}