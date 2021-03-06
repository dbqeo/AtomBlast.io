/**
 * This constant stores all data that is used to define Blueprints,
 * which define the recipe and behaviors of Compounds.
 *
 * Fields required:
 * Name: The formatted name of the compound to display
 * Unlocked: TEMPORARY. True if it should show up on initial load, false if it needs to be unlocked from playing.
 * Tooltip: Description of compound
 * Texture: Path to image to load
 * Type: Class of compound. Each different type has a different behavior as defined in `compound.js`.
 * Params: Optional parameters to pass to the compound class associated with the given type.
 * Atoms: How to make the compound. Format is `Element symbol: Number required`. All excluded atoms will be considered 0.
 */
export const BLUEPRINTS = {
	binaryHydrogen: {
		name: 'Hydrogen',
		unlocked: true,
		tooltip: 'This is quite literally the smallest compound in the universe. Why are you using this as a weapon?',
		texture: 'compound_PLACEHOLDER.png',
		type: 'flammable',
		params: {
			speed: 5 * 3,
			damage: 3,
			size: 20,
			splashDamage: 10,
			splash: 50,
			splashImage: '../assets/explosion.png'
		},
		atoms: {
			h: 2
		}
	},
	basicMethane: {
		name: 'Methane',
		unlocked: false,
		tooltip: 'Okay, who passed gas?',
		texture: 'compound_PLACEHOLDER.png',
		type: 'flammable',
		params: {
			speed: 3 * 3,
			damage: 3,
			size: 10
		},
		atoms: {
			c: 1,
			h: 4
		}
	},
	basicBenzene: {
		name: 'Benzene',
		unlocked: false,
		tooltip: 'Carbon rings. They smell nice.',
		texture: 'compound_PLACEHOLDER.png',
		type: 'inert',
		params: {
			speed: 1 * 3,
			damage: 5,
			size: 30
		},
		atoms: {
			h: 6,
			c: 6
		}
	},
	basicWater: {
		name: 'Water',
		unlocked: true,
		tooltip: 'Why life exists. Are you trying to drown someone?',
		texture: 'compound_PLACEHOLDER.png',
		type: 'stream',
		params: {
			speed: 4 * 3,
			damage: 1,
			size: 15,
			length: 10,
			spacing: 50,
			compoundsPerCraft: 10,
			evaporate: true
		},
		atoms: {
			h: 2,
			o: 1
		}
	},
	binaryNitrogen: {
		name: 'Nitrogen',
		unlocked: true,
		tooltip: '78% of your air, and also why you get the bends.',
		texture: 'compound_PLACEHOLDER.png',
		type: 'inert',
		params: {
			speed: 3 * 3,
			damage: 3,
			size: 20
		},
		atoms: {
			n: 2
		}
	},
	carbon: {
		name: 'Carbon',
		unlocked: true,
		tooltip: 'The building block of life.',
		texture: 'placeholder_barrier.png',
		type: 'block',
		params: {
			health: 1,
			size: 50,
			speed: 0
		},
		atoms: {
			c: 1
		}
	},
	binaryHelium: {
		name: 'Helium',
		unlocked: false,
		tooltip: 'A nonreactive, inert gas. In other words, useless.',
		texture: 'compound_PLACEHOLDER.png',
		type: 'inert',
		params: {
			speed: 4 * 3,
			damage: 2,
			size: 14
		},
		atoms: {
			he: 2
		}
	},
	ionicSodiumChloride: {
		name: 'Sodium Chloride',
		unlocked: false,
		tooltip: 'Can kill small insects, slugs, and snails. Cannot kill much else.',
		texture: 'compound_PLACEHOLDER.png',
		type: 'ionic',
		params: {
			speed: 4 * 3,
			damage: 2,
			size: 14
		},
		atoms: {
			na: 1,
			cl: 1
		}
	},
	acidicHydrogenChloride: {
		name: 'Hydrochloric Acid',
		unlocked: false,
		tooltip: 'In a pure form, can corrode metal.',
		texture: 'compound_PLACEHOLDER.png',
		type: 'acidic',
		params: {
			speed: 4 * 3,
			damage: 2,
			size: 14
		},
		atoms: {
			h: 1,
			cl: 1
		}
	},
	nuclearLithiumHydrogen: {
		name: 'Lithium Deuteride',
		unlocked: false,
		tooltip: 'Used as the primary fuel in thermonuclear weapons.',
		texture: '../assets/spritesheet/atoms/atom_lithium.png',
		type: 'nuclear',
		params: {
			speed: 1 * 3,
			damage: 2,
			size: 14
		},
		atoms: {
			h: 1,
			li: 1
		}
	},
	glucose: {
		name: 'Sugar',
		unlocked: true,
		tooltip: 'S U G A R R U S H !!!!',
		texture: 'compound_sugar.png',
		type: 'speed',
		params: {
			speedFactor: 0.5
		},
		atoms: {
			c: 6,
			h: 12,
			o: 6
		}
	},
	protonPack: {
		name: 'Proton Pack',
		unlocked: false,
		tooltip: 'Easy health!',
		texture: 'compound_PLACEHOLDER.png',
		type: 'health',
		params: {
			healthModifier: 10
		},
		atoms: {
			h: 10
		}
	},
	ozone: {
		name: 'Ozone',
		unlocked: true,
		tooltip: 'Shield em up!',
		texture: 'compound_ozone.png',
		type: 'defense',
		params: {
			defenseModifier: 2
		},
		atoms: {
			o: 3
		}
	},
	cyanide: {
		name: 'Cyanide',
		unlocked: true,
		tooltip: 'Less deadly and more happy than Cyanide and Happiness.',
		texture: 'cyanide.png',
		type: 'toxic',
		params: {
			speed: 2,
			splashDamage: 0.2,
			size: 100
		},
		atoms: {
			c: 1,
			n: 1
		}
	},
	nitricAcid: {
		name: 'Nitric Acid',
		unlocked: true,
		tooltip: 'Contains "NO"... as in NO don\'t use this',
		texture: 'compound_PLACEHOLDER.png',
		type: 'acid',
		params: {
			damagePerSecond: 2,
			size: 100,
			speed: 0
		},
		atoms: {
			h: 1,
			n: 1,
			o: 3
		}
	}
}

/**
 * Contains descriptions for the different types of compounds (acid, stream, etc)
 */
export const TOOLTIPS = {
	flammable: 'Flammable: When passing over a lava pit, this compound ignites, dealing additional damage.',
	stream: 'Stream: Hold down the shoot button to shoot a large number of individual compounds, like a stream. Several individual compounds can be shot using a single recipe.',
	inert: 'Inert: Just a plain old compound. You can shoot it and it can hit stuff, that is all.',
	block: 'Block: Place it down to protect strategic points! Deals no damage, but will intercept compounds if touched.',
	speed: 'Speed: When consumed, it makes you move faster!',
	defense: 'Defense: When consumed, it increases your shield. Damage below your shield amount will not harm you.',
	toxic: 'Toxic: Moves slowly, but deals splash damage to everyone inside the radius.',
	acid: 'Acid: Places a stationary pool of corrosive material that damages all who touches it. If a base touches it, then both react to create water.',
	base: 'Base: Acts like an inert compound, but when it is shot at acid, it will react to create water.'
}
