class Pokemons {
    constructor() {
        this.pokemons = [];
        this.addPokemon();
        this.current = -1;
    }

    async addPokemon() {
        const data = await this.getRandomPokemon();
        this.pokemons.push(new Pokemon(data));
    }

    next() {
        this.current++;
        if (this.current == this.pokemons.length - 1) {
            this.addPokemon();
        }
        this.pokemons[this.current].updateStats();
    }

    previous() {
        if (this.current <= 0) {
            console.log("Can't go back any further");
            return;
        }
        this.current--;
        this.pokemons[this.current].updateStats();
    }

    generateRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async getRandomPokemon() {
        try {
            // Generate a random Pokemon ID (PokeAPI has a total of 898 Pokémon)
            const randomPokemonId = this.generateRandomInt(1, 898);
    
            // Make a request to the PokeAPI
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
            
            // Check if the request was successful (status code 200)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Parse the JSON response
            const data = await response.json();
            console.log(data);

            return data;
        } catch (error) {
            console.error("Error fetching random Pokémon:", error);
        }
    }
}

class Pokemon {
    constructor(data) {
        this.name = this.capitalizeFirstLetter(data.name);
        this.id = data.id;
        this.types = data.types.map(type => type.type.name).join(", ");
        this.hp = data.stats[0].base_stat;
        this.attack = data.stats[1].base_stat;
        this.defense = data.stats[2].base_stat;
        this.specialAttack = data.stats[3].base_stat;
        this.specialDefense = data.stats[4].base_stat;
        this.speed = data.stats[5].base_stat;
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    updateStats() {
        document.querySelector(".pokemon-card img").src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`;
        document.getElementById("name").textContent = this.name;
        document.getElementById("hp").textContent = this.hp;
        document.getElementById("attack").textContent = this.attack;
        document.getElementById("defense").textContent = this.defense;
        document.getElementById("speed").textContent = this.speed;
    }
}

class Controls {
    constructor(pokemons) {
        this.pokemons = pokemons;
        this.previous = document.querySelector(".previous");
        this.next = document.querySelector(".next");
        this.loadEventListeners();
    }

    loadEventListeners() {
        this.previous.addEventListener("click", this.previousPokemon.bind(this));
        this.next.addEventListener("click", this.nextPokemon.bind(this));
    }

    previousPokemon() {
        this.pokemons.previous();
    }

    nextPokemon() {
        this.pokemons.next();
    }
}

const pokemons = new Pokemons();
const controls = new Controls(pokemons);
