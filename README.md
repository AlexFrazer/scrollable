# scrollable

Small React utility that allows smooth scrolling to components.

## Usage

1. Use the `ScrollableGroup` around all items you want to be scrollable.
2. Any item that you want to register as an item that can be scrolled to must have a unique `scrollableKey` property.

```
import * as React from 'react';
import { ScrollableGroup } from '@corvid/scrollable';

export default class List extends React.PureComponent {
  renderList() {
    return this.props.items.map((item) => (
      <ListItem key={item.id} scrollableKey={item.id} {...item} />
    ));
  }

  render() {
    return (
      <ScrollableGroup>
        {this.renderList()}
      </ScrollableGroup>
    )
  }
}
```

> NOTE: `ScrollableGroup` extends the `React.HTMLProps` interface, meaning anything that can be passed to a div can be passed to the `ScrollableGroup`

3. Make sure to use the `createScrollable` HOC on the children that can be scrolled to.

```
import * as React from 'react';
import { createSelectable } from '@corvid/scrollable';

export default createSelectable(function ListItem() {
  return <div />;
});

// or as a decorator
@createSelectable
export default class ListItem extends React.PureComponent {
  render() {
    return <div />
  }
}
```

### Scrolling to an item

`ScrollableGroup` provides a `scrollToItem`. Use the `ref` to store a reference to it,
then use the props to delegate it.

Here is a simple example:

```
import * as React from 'react';
import { ScrollableGroup } from '@corvid/scrollable';

export interface Props {
  items: Item[];
  selected: string;
}

export default class List extends React.PureComponent<Props> {
  scrollable: ScrollableGroup;

  ref: React.Ref<ScrollableGroup> = (r: ScrollableGroup) => {
    if (r) {
      this.scrollable = r;
    }
  };

  componentWillReceiveProps({ selected }) {
    if (selected !== this.props.selected && this.scrollable) {
      this.scrollable.scrollToItem(selected);
    }
  }

  renderList() {
    return this.props.items.map((item) => (
      <ListItem key={item.id} scrollableKey={item.id} {...item} />
    ));
  }

  render() {
    return (
      <ScrollableGroup>
        {this.renderList()}
      </ScrollableGroup>
    )
  }
}
```
