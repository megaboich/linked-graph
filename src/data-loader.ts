import {Triple} from './triple'

export class DataLoader {
    LoadData(): Promise<Triple[]> {
        return new Promise(function (resolve, reject) {
            fetch('/testdata')
                .then(response => {
                    return response.json()
                }).then(json => {
                    resolve(json as Triple[]);
                }).catch(function (ex) {
                    console.log('loading failed', ex)
                })
        });
    }
}