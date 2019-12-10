/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

console.disableYellowBox = true
// console.ignoredYellowBox = ['Setting timer for a long time']

AppRegistry.registerComponent(appName, () => App)
