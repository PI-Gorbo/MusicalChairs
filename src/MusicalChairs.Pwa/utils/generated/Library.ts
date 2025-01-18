import { Remoting_buildProxy_64DC51C } from "./fable_modules/Fable.Remoting.Client.7.32.0/Remoting.fs.js";
import { RemotingModule_createApi, RemotingModule_withBaseUrl } from "./fable_modules/Fable.Remoting.Client.7.32.0/Remoting.fs.js";
import { Server, Server_$reflection } from "./MusicalChairs.Shared/Library.js";
import { startAsPromise } from "./fable_modules/fable-library-ts.4.24.0/Async.js";
import { int32 } from "./fable_modules/fable-library-ts.4.24.0/Int32.js";

export const server: Server = Remoting_buildProxy_64DC51C<Server>(RemotingModule_withBaseUrl("http://localhost:5000", RemotingModule_createApi()), Server_$reflection());

export function count(): Promise<int32> {
    return startAsPromise(server.count());
}

