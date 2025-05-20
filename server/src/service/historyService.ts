import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class State {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  private async write(states: State[]) {
    return await fs.writeFile('db/db.json', JSON.stringify(states, null, '\t'));
  }

  async getStates() {
    return await this.read().then((states) => {
      let parsedStates: State[];

      // If states isn't an array or can't be turned into one, send back a new empty array
      try {
        parsedStates = [].concat(JSON.parse(states));
      } catch (err) {
        parsedStates = [];
      }

      return parsedStates;
    });
  }

  async addState(state: string) {
    if (!state) {
      throw new Error('state cannot be blank');
    }

    // Add a unique id to the state using uuid package
    const newState: State = { name: state, id: uuidv4() };

    // Get all cities, add the new city, write all the updated cities, return the newCity
    return await this.getStates()
      .then((states) => {
        if (states.find((index) => index.name === state)) {
          return states;
        }
        return [...states, newState];
      })
      .then((updatedStates) => this.write(updatedStates))
      .then(() => newState);
  }

  async removeState(id: string) {
    return await this.getStates()
      .then((states) => states.filter((state) => state.id !== id))
      .then((filteredStates) => this.write(filteredStates));
  }
}
// Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// Extend the HistoryService class to handle cities
export class CityHistoryService {
  // Define a read method that reads from the searchHistory.json file
  private async readCities() {
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async writeCities(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.readCities().then((cities) => {
      let parsedCities: City[];

      // If cities isn't an array or can't be turned into one, send back a new empty array
      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('city cannot be blank');
    }

    // Add a unique id to the city using uuid package
    const newCity: City = { name: city, id: uuidv4() };

    // Get all cities, add the new city, write all the updated cities, return the newCity
    return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.writeCities(updatedCities))
      .then(() => newCity);
  }

  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.writeCities(filteredCities));
  }
}

export const historyService = new HistoryService();

