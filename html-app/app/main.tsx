import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Router, Route, useRouterHistory } from 'react-router'
import { createHashHistory } from 'history'

import { RootView } from './root/root'

(() => {
    const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })
    ReactDOM.render(
        <Router history={appHistory}>
            <Route path="/" component={RootView}/>
            {/* add the routes here */}
            {/*<Route path="/example" component={ExampleView}/>*/}
        </Router>,
        document.getElementById('content')
    );
})();
