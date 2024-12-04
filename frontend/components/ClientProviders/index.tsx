"use client";

import Framework7 from 'framework7/lite';
import Framework7React, { App, View } from 'framework7-react';

Framework7.use(Framework7React);

// App routes
const routes = [
  {
    path: '/',
    asyncComponent: () => import('./index'),
  },
  {
    path: '/test',
    asyncComponent: () => import('@/app/test/page'),
  },
];

export default function ClientProviders({ children }) {
  const url = window?.location?.href;

  return (
    <App url={url} routes={routes} theme="auto">
      {/*
        Create main View.
        Apparently we need to enable browserHistory to navigating by URL
      */}
      <View
        main
        browserHistory
        browserHistorySeparator=""
        browserHistoryInitialMatch={true}
        browserHistoryStoreHistory={false}
        url="/"
      >
        {children}
      </View>
    </App>
  );
}