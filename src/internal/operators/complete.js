import Completable from '../../completable';
import { immediateComplete } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  immediateComplete(observer);
}

let INSTANCE;
/**
 * @ignore
 */
export default () => {
  if (typeof INSTANCE === 'undefined') {
    INSTANCE = new Completable(subscribeActual);
    INSTANCE.subscribeActual = subscribeActual.bind(INSTANCE);
  }
  return INSTANCE;
};
