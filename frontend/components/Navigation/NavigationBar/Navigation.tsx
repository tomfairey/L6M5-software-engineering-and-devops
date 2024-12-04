"use client"

import { useState } from "react";
import { Icon, Tabbar, TabbarLink } from "konsta/react";
import { HouseFill } from 'framework7-icons/react';
import { MdHome, MdScience, MdSettings } from "react-icons/md";

import type { NavigationProps } from "./Navigation.types";
import { useEffect } from "react";
import Link from "next/link";

export function Navigation(props: NavigationProps) {
    const { items } = props;

    // const [currentPath, setCurrentPath] = useState(window?.location?.pathname);

    // useEffect(() => {
    //     setCurrentPath(window.location.pathname);
    // }, [ window?.location?.pathname ]);

    const currentPath = window.location.pathname;

    return (
        <>
            <Tabbar className="left-0 bottom-0 fixed" labels={true} icons={true}>
                <TabbarLink linkProps={{href: "/test"}} active={ currentPath && currentPath == "/test" || false } label="Test" icon={<Icon ios={<HouseFill className="w-7 h-7" />} material={<MdScience className="w-6 h-6" />} />} />
                <TabbarLink linkProps={{href: "/"}} active={ currentPath && currentPath == "/" || false } label="Home" icon={<Icon ios={<HouseFill className="w-7 h-7" />} material={<MdHome className="w-6 h-6" />} />} />
                <TabbarLink linkProps={{href: "/settings"}} active={ currentPath && currentPath == "/settings" || false } label="Settings" icon={<Icon ios={<HouseFill className="w-7 h-7" />} material={<MdSettings className="w-6 h-6" />} />} />
            </Tabbar>
        </>
    )
}