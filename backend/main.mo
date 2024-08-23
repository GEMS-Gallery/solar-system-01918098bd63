import Bool "mo:base/Bool";
import Func "mo:base/Func";

import Array "mo:base/Array";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

actor {
  // Planet type definition
  type Planet = {
    id: Nat;
    name: Text;
    orbitalPeriod: ?Float;
    gravity: ?Float;
  };

  // Stable variable to store planet data
  stable var planets: [Planet] = [
    { id = 0; name = "Mercury"; orbitalPeriod = ?87.97; gravity = ?3.7 },
    { id = 1; name = "Venus"; orbitalPeriod = ?224.7; gravity = ?8.87 },
    { id = 2; name = "Earth"; orbitalPeriod = ?365.26; gravity = ?9.81 },
    { id = 3; name = "Mars"; orbitalPeriod = ?687.0; gravity = ?3.71 },
    { id = 4; name = "Jupiter"; orbitalPeriod = ?4333.0; gravity = ?24.79 },
    { id = 5; name = "Saturn"; orbitalPeriod = ?10759.0; gravity = ?10.44 },
    { id = 6; name = "Uranus"; orbitalPeriod = ?30687.0; gravity = ?8.69 },
    { id = 7; name = "Neptune"; orbitalPeriod = ?60190.0; gravity = ?11.15 }
  ];

  // Function to get all planets
  public query func getPlanets() : async [Planet] {
    planets
  };

  // Function to get information about a specific planet
  public query func getPlanetInfo(id: Nat) : async ?Planet {
    Array.find(planets, func (p: Planet) : Bool { p.id == id })
  };

  // Debug print function for testing
  public func debugPrint() : async () {
    for (planet in planets.vals()) {
      Debug.print("Planet: " # planet.name);
    };
  };
}
