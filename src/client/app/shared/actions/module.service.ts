import {Injectable} from '@angular/core';
import * as PiStation from '../../../PiStation';
import * as Rx from 'rxjs/Rx';

@Injectable() export class ModuleService {
    private socket : SocketIOClient.Socket = io.connect('http://localhost:31415');

    getAllModules() : Rx.Observable<PiStation.Module[]> {
        this.socket.emit(PiStation.Events.GET_ALL_MODULES);
        return Rx.Observable.fromEvent<PiStation.Module[]>(this.socket, PiStation.Events.GET_ALL_MODULES);
    }

    sendModuleFunction(module : PiStation.Module, func : PiStation.Function, args: PiStation.Argument[] = []) {
        this.socket.emit(this.getEventNameForModuleFunction(module, func), args);
    }

    private getEventNameForModuleFunction(module : PiStation.Module, func : PiStation.Function) {
        return `${module.name}:${func.name}`;
    }
}
