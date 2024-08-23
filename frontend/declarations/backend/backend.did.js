export const idlFactory = ({ IDL }) => {
  const Planet = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'gravity' : IDL.Opt(IDL.Float64),
    'orbitalPeriod' : IDL.Opt(IDL.Float64),
  });
  return IDL.Service({
    'debugPrint' : IDL.Func([], [], []),
    'getPlanetInfo' : IDL.Func([IDL.Nat], [IDL.Opt(Planet)], ['query']),
    'getPlanets' : IDL.Func([], [IDL.Vec(Planet)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
