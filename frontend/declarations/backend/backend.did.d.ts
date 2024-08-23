import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Planet {
  'id' : bigint,
  'name' : string,
  'gravity' : [] | [number],
  'orbitalPeriod' : [] | [number],
}
export interface _SERVICE {
  'debugPrint' : ActorMethod<[], undefined>,
  'getPlanetInfo' : ActorMethod<[bigint], [] | [Planet]>,
  'getPlanets' : ActorMethod<[], Array<Planet>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
