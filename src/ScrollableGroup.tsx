import * as React from 'react';
import * as PropTypes from 'prop-types';

type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

// Change ref type.
export interface Props extends Omit<React.HTMLProps<HTMLDivElement>, 'ref'> {
  ref?: React.Ref<Scrollable>;
}

export default class Scrollable extends React.PureComponent<Props> {
  static childContextTypes = {
    scrollable: PropTypes.shape({
      register: PropTypes.func.isRequired,
      unregister: PropTypes.func.isRequired,
    }).isRequired,
  };

  getChildContext() {
    return {
      scrollable: {
        register: this.register,
        unregister: this.unregister,
      },
    };
  }

  container: HTMLDivElement;
  registry: Map<string, any> = new Map();
  register = (id: string, e: any) => this.registry.set(id, e);
  unregister = (id: string) => this.registry.delete(id);

  /**
   * Given a key that is registered in the store,
   * smooth-scroll to that item.
   * @param {string} key the key to scroll to
   * @param {Function} callback what to do when the animation is complete
   */
  scrollToItem = (key: string, callback?: Function) => {
    const item = this.registry.get(key);
    if (item) {
      item.scrollIntoView(this.container, callback);
    }
  };

  ref: React.Ref<HTMLDivElement> = element => {
    if (element) {
      this.container = element;
    }
    if (this.props.ref instanceof Function) {
      this.props.ref(this);
    }
  };

  render() {
    return <div {...this.props} ref={this.ref} />;
  }
}
