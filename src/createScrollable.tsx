import * as React from 'react';
import * as PropTypes from 'prop-types';
import { requestAnimFrame, getDisplayName, easeInOutQuad } from './utils';

export interface EasingFunction {
  (t: number, b: number, c: number, d: number): number;
}

export interface Props {
  scrollableKey: any;
  easing?: EasingFunction;
}

export default function createScrollable<TProps>(WrappedComponent: React.ComponentType<TProps>) {
  return class extends React.PureComponent<TProps & Props> {
    static displayName = `Scrollable(${getDisplayName(WrappedComponent)})`;

    static defaultProps: Partial<Props> = {
      easing: easeInOutQuad,
    };

    static contextTypes = {
      scrollable: PropTypes.shape({
        register: PropTypes.func.isRequired,
        unregister: PropTypes.func.isRequired,
      }).isRequired,
    };

    componentDidMount() {
      this.context.scrollable.register(this.props.scrollableKey, this);
    }

    componentWillUnmount() {
      this.context.scrollable.unregister(this.props.scrollableKey);
    }

    /**
     * Scrolls this item into view
     * @param {HTMLElement} [parent=document.body] the parent scroll container
     * @param {Function} callback what to do when the animation is complete.
     * @param {number} [duration=500]
     */
    scrollIntoView = (
      parent: HTMLElement = document.body,
      callback: Function = () => {},
      duration: number = 500,
      increment: number = 20,
    ) => {
      const { easing } = this.props;
      const start = parent.scrollTop;
      const change = this.container.offsetTop - this.container.offsetHeight - start;

      let currentTime = 0;
      const animateScroll = () => {
        currentTime += increment;
        parent.scrollTop = easing(currentTime, start, change, duration);
        if (currentTime < duration) {
          requestAnimFrame(animateScroll);
        } else {
          callback();
        }
      };
      animateScroll();
    };

    container: HTMLDivElement;

    ref: React.Ref<HTMLDivElement> = element => {
      if (element) {
        this.container = element;
      }
    };

    render() {
      return (
        <div ref={this.ref}>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
}
