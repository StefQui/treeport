import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Collapse } from 'reactstrap';

var tree = [
  {
    text: 'Parent 1',
    nodes: [
      {
        text: 'Child 1',
        nodes: [
          {
            text: 'Grandchild 1',
          },
          {
            text: 'Grandchild 2',
          },
        ],
      },
      {
        text: 'Child 2',
      },
    ],
  },
  {
    text: 'Parent 2',
  },
  {
    text: 'Parent 3',
  },
  {
    text: 'Parent 4',
  },
  {
    text: 'Parent 5',
  },
];

class MyTree extends Component {
  state = {};
  toggle = event => {
    const id = event.target.getAttribute('id');
    this.setState(state => ({ [id]: !state[id] }));
  };
  mapper = (nodes, parentId?, lvl?) => {
    return nodes.map((node, index) => {
      const id = `${node.text}-${parentId ? parentId : 'top'}`.replace(/[^a-zA-Z0-9-_]/g, '');
      const item = (
        <React.Fragment>
          <ListGroupItem style={{ zIndex: 0 }} className={`${parentId ? `rounded-0 ${lvl ? 'border-bottom-0' : ''}` : ''}`}>
            {
              <div style={{ paddingLeft: `${25 * lvl}px` }}>
                {node.nodes && (
                  <Button className="pl-0" color="link" id={id} onClick={this.toggle}>
                    {this.state[id] ? '-' : '+'}
                  </Button>
                )}
                {node.text}
              </div>
            }
          </ListGroupItem>
          {node.nodes && <Collapse isOpen={this.state[id]}>{this.mapper(node.nodes, id, (lvl || 0) + 1)}</Collapse>}
        </React.Fragment>
      );

      return item;
    });
  };

  render() {
    return <ListGroup>{this.mapper(tree)}</ListGroup>;
  }
}

export default MyTree;
