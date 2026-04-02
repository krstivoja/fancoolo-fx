/**
 * FX class parsing and generation utilities.
 *
 * Parses a className string into an FX config object and generates
 * the correct className string from a config object.
 */

// All known effect slugs (kebab-case as used in class names)
const EFFECTS = [
	{ value: 'text-reveal', label: 'Text Reveal' },
	{ value: 'reveal', label: 'Reveal' },
	{ value: 'spin-reveal', label: 'Spin Reveal' },
	{ value: 'bg-reveal', label: 'BG Reveal' },
	{ value: 'scale-in', label: 'Scale In' },
	{ value: 'fade-in', label: 'Fade In' },
	{ value: 'blur-in', label: 'Blur In' },
	{ value: 'clip-up', label: 'Clip Up' },
	{ value: 'clip-down', label: 'Clip Down' },
	{ value: 'tilt-in', label: 'Tilt In' },
	{ value: 'type-writer', label: 'Type Writer' },
	{ value: 'draw-svg', label: 'Draw SVG' },
	{ value: 'parallax', label: 'Parallax' },
	{ value: 'split-words', label: 'Split Words' },
	{ value: 'slide-left', label: 'Slide Left' },
	{ value: 'slide-right', label: 'Slide Right' },
];

// Effects that are always scrub-based (no trigger choice)
const SCRUB_EFFECTS = [ 'tilt-in', 'parallax' ];

// Modifier keys we recognize
const MODIFIER_KEYS = [ 'duration', 'delay', 'stagger', 'ease', 'start', 'y', 'scrub' ];

/**
 * Build a sorted list of all possible FX class prefixes for matching.
 * Sorted longest-first so "slide-left" matches before "slide".
 */
const EFFECT_SLUGS = EFFECTS.map( ( e ) => e.value ).sort(
	( a, b ) => b.length - a.length
);

/**
 * Parse a className string into an FX config object.
 *
 * @param {string} className - The block's className attribute.
 * @return {Object} { effect, trigger, modifiers: {}, otherClasses }
 */
export function parseFxClasses( className ) {
	if ( ! className ) {
		return { effect: '', trigger: '', modifiers: {}, otherClasses: '' };
	}

	const classes = className.split( /\s+/ ).filter( Boolean );
	const otherClasses = [];
	let effect = '';
	let trigger = '';
	const modifiers = {};

	// Special case: fx-draw-svg-scrub
	let drawSvgScrub = false;

	for ( const cls of classes ) {
		// Check for draw-svg-scrub special class
		if ( cls === 'fx-draw-svg-scrub' ) {
			effect = 'draw-svg';
			trigger = 'scrub';
			drawSvgScrub = true;
			continue;
		}

		// Check for modifier classes: fx-{key}-[{value}]
		let isModifier = false;
		for ( const key of MODIFIER_KEYS ) {
			const prefix = `fx-${ key }-[`;
			if ( cls.startsWith( prefix ) && cls.endsWith( ']' ) ) {
				const val = cls.slice( prefix.length, -1 );
				modifiers[ key ] = isNaN( parseFloat( val ) ) ? val : parseFloat( val );
				isModifier = true;
				break;
			}
		}
		if ( isModifier ) continue;

		// Check for effect classes: fx-{slug}-pl, fx-{slug}-st, fx-{slug}
		let isEffect = false;
		for ( const slug of EFFECT_SLUGS ) {
			const base = `fx-${ slug }`;
			if ( cls === `${ base }-pl` ) {
				effect = slug;
				trigger = 'pl';
				isEffect = true;
				break;
			}
			if ( cls === `${ base }-st` ) {
				effect = slug;
				trigger = 'st';
				isEffect = true;
				break;
			}
			if ( cls === base ) {
				effect = slug;
				trigger = '';
				isEffect = true;
				break;
			}
		}
		if ( isEffect ) continue;

		// Not an FX class — preserve it
		otherClasses.push( cls );
	}

	return { effect, trigger, modifiers, otherClasses: otherClasses.join( ' ' ) };
}

/**
 * Generate a className string from an FX config object.
 *
 * @param {Object} config - { effect, trigger, modifiers: {}, otherClasses }
 * @return {string} The combined className string.
 */
export function generateFxClasses( config ) {
	const parts = [];

	// Other (non-FX) classes first
	if ( config.otherClasses ) {
		parts.push( config.otherClasses );
	}

	if ( ! config.effect ) {
		return parts.join( ' ' ).trim();
	}

	// Special case: draw-svg scrub mode
	if ( config.effect === 'draw-svg' && config.trigger === 'scrub' ) {
		parts.push( 'fx-draw-svg-scrub' );
	} else if ( SCRUB_EFFECTS.includes( config.effect ) ) {
		// Scrub effects: use -st suffix (they're always scroll-linked)
		parts.push( `fx-${ config.effect }-st` );
	} else {
		// Normal effects with trigger suffix
		const suffix = config.trigger ? `-${ config.trigger }` : '';
		parts.push( `fx-${ config.effect }${ suffix }` );
	}

	// Modifiers
	const mods = config.modifiers || {};
	for ( const key of MODIFIER_KEYS ) {
		if ( mods[ key ] !== undefined && mods[ key ] !== '' && mods[ key ] !== null ) {
			parts.push( `fx-${ key }-[${ mods[ key ] }]` );
		}
	}

	return parts.join( ' ' ).trim();
}

export { EFFECTS, SCRUB_EFFECTS, MODIFIER_KEYS };
