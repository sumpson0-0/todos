import { DefaultTheme } from 'styled-components';
import { css } from 'styled-components';

type BackQuoteArgs = string[];

const theme: DefaultTheme = {
	light: {
		mainColor: '#2D2D2D',
		subColor: '#ffe1a8',
		lineColor: '#d9d9d9',
		textColor: '#ffffff',
		warnColor: '#EE6C4D',
	},
	media: {
		portraitMobile: (...args: BackQuoteArgs): undefined => undefined,
		landscapeMobile: (...args: BackQuoteArgs): undefined => undefined,
		portraitTabletS: (...args: BackQuoteArgs): undefined => undefined,
		portraitTablet: (...args: BackQuoteArgs): undefined => undefined,
		landscapeTablet: (...args: BackQuoteArgs): undefined => undefined,
		desktop: (...args: BackQuoteArgs): undefined => undefined,
	},
};

const sizes: { [key: string]: number } = {
	/*  Smartphones in portrait mode -> max-width : 428 */
	portraitMobile: 428,
	/*  Smartphones in landscape mode -> 429x927 */
	landscapeMobile: 927,
	/*  Tablets in portrait mode (Size S) -> 429x767 */
	portraitTabletS: 767,
	/*  Tablets in portrait mode -> 768X1023 */
	portraitTablet: 1023,
	/*  Tablets in landscape mode, older desktop monitors -> 1024X1365 */
	landscapeTablet: 1365,
	/* Monitors with screen width 1366px or above -> 1366 and above */
	desktop: 1366,
};

Object.keys(sizes).reduce((media: DefaultTheme['media'], label: string) => {
	switch (label) {
		default:
			break;
		case 'portraitMobile':
			media.portraitMobile = (...args: BackQuoteArgs) =>
				css`
					@media only screen and (max-width: ${sizes.portraitMobile}px) and (orientation: portrait) {
						${args}
					}
				`;
			break;
		case 'landscapeMobile':
			media.landscapeMobile = (...args: BackQuoteArgs) =>
				css`
					@media only screen and (max-width: ${sizes.landscapeMobile}px) and (min-width: ${sizes.portraitMobile +
						1}px) and (orientation: landscape) {
						${args}
					}
				`;
			break;
		case 'portraitTabletS':
			media.portraitTabletS = (...args: BackQuoteArgs) =>
				css`
					@media only screen and (max-width: ${sizes.portraitTabletS}px) and (min-width: ${sizes.portraitMobile +
						1}px) and (orientation: portrait) {
						${args}
					}
				`;
			break;
		case 'portraitTablet':
			media.portraitTablet = (...args: BackQuoteArgs) =>
				css`
					@media only screen and (max-width: ${sizes.portraitTablet}px) and (min-width: ${sizes.portraitTabletS +
						1}px) and (orientation: portrait) {
						${args}
					}
				`;
			break;
		case 'landscapeTablet':
			media.landscapeTablet = (...args: BackQuoteArgs) =>
				css`
					@media only screen and (max-width: ${sizes.landscapeTablet}px) and (min-width: ${sizes.landscapeMobile +
						1}px) {
						${args}
					}
				`;
			break;
		case 'desktop':
			media.desktop = (...args: BackQuoteArgs) =>
				css`
					@media only screen and (min-width: ${sizes.desktop}px) {
						${args}
					}
				`;
			break;
	}
	return media;
}, theme.media);

export default theme;
