// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

declare global {
	namespace App {
		interface Locals {}
		interface PageData {}
		interface Error {}
		interface Platform {}
	}
}

declare module '$env/static/public' {
	export const PUBLIC_MAPBOX_TOKEN: string;
}
