import { Cancellable, BooleanCancellable } from 'rx-cancellable';
/**
 * Abstraction over a CompletableObserver that allows associating
 * a resource with it.
 *
 * Calling onComplete() multiple times has no effect.
 * Calling onError(Error) multiple times or after onComplete
 * has no effect.
 */
// eslint-disable-next-line no-unused-vars
export default class CompletableEmitter extends Cancellable {
  constructor(complete, error) {
    super();
    /**
     * @ignore
     */
    this.complete = complete;
    /**
     * @ignore
     */
    this.error = error;
    /**
     * @ignore
     */
    this.linked = new BooleanCancellable();
  }

  /**
   * Returns true if the emitter is cancelled.
   * @returns {boolean}
   */
  get cancelled() {
    return this.linked.cancelled;
  }

  /**
   * Returns true if the emitter is cancelled successfully.
   * @returns {boolean}
   */
  cancel() {
    if (!this.cancelled) {
      this.events.cancel.forEach(f => f.apply(this));
      return this.linked.cancel();
    }
    return false;
  }

  /**
   * Set the given Cancellable as the Emitter's cancellable state.
   * @param {Cancellable} cancellable
   * The Cancellable instance
   * @returns {boolean}
   * Returns true if the cancellable is valid.
   */
  setCancellable(cancellable) {
    if (cancellable instanceof Cancellable) {
      if (this.cancelled) {
        cancellable.cancel();
      } else if (cancellable.cancelled) {
        this.cancel();
        return true;
      } else {
        const { linked } = this;
        this.linked = cancellable;
        linked.cancel();
        return true;
      }
    }
    return false;
  }

  /**
   * Emits a completion.
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onComplete() {
    if (this.cancelled) {
      return;
    }
    try {
      this.complete();
    } finally {
      this.cancel();
    }
  }

  /**
   * Emits an error value.
   * @param {!Error} err
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onError(err) {
    let report = err;
    if (!(err instanceof Error)) {
      report = new Error('onError called with a non-Error value.');
    }
    if (this.cancelled) {
      return;
    }
    try {
      this.error(report);
    } finally {
      this.cancel();
    }
  }
}
