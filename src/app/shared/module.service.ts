import {Injectable} from '@angular/core';
import * as PiStation from 'pistation-definitions/PiStation';
import {Observable} from "rxjs/Rx";
import * as io from 'socket.io-client';

@Injectable() export class ModuleService {
    private socket : SocketIOClient.Socket = io.connect(`http://${API_URL}:${API_PORT}`);

    constructor(){
      console.log(`http://${API_URL}:${API_PORT}`);
    }
    getAllModules() : Observable<PiStation.Module[]> {
        this.socket.emit(`${PiStation.Events.GET_ALL_MODULES}`);

        return Observable.fromEvent(this.socket, `${PiStation.Events.GET_ALL_MODULES}`)
            .map((modulesJSON : any[]) => modulesJSON.map(module => new PiStation.Module(module.name, module.functions)));
    }
    callModuleFunction(func : PiStation.Function, args: any) {
        console.log(`Sending ${func.eventName} with arguments : ${func.arguments}`);

        const updateStream = Observable.create(observer => {
            this.socket.on(func.eventName, (data) => observer.next(data));
            this.socket.on(`${func.completedEventName}`,()=>observer.complete());
            this.socket.on(`${func.errorEventName}`, (error)=> observer.error(error));
        }); //create observable with function update stream to UI

        this.socket.emit(func.eventName,args);
        return updateStream;

    }
}
