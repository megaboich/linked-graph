import * as ko from "knockout";

import { Subject } from 'rxjs/Subject';

export class SidePanelViewModel {
    newNodeName = ko.observable("");
    newNodeSubject = new Subject<string>();

    constructor() {
    }

    addChild = () => {
        this.newNodeSubject.next(this.newNodeName());
        this.newNodeName("");
    }
}
