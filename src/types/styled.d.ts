// TypeScript declaration for styled-components theme
import 'styled-components/native';
import { BlueWhiteTheme } from '../theme/bluewhite';

declare module 'styled-components/native' {
  export interface DefaultTheme extends BlueWhiteTheme {}
}
