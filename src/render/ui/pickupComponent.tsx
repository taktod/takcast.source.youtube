import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactBootstrap from "react-bootstrap";

var Form = ReactBootstrap.Form;
var FormGroup = ReactBootstrap.FormGroup;
var FormControl = ReactBootstrap.FormControl;
var InputGroup = ReactBootstrap.InputGroup;
var Button = ReactBootstrap.Button;

export var pickupComponent = ():any => {
  return class pickupComponent extends React.Component<{}, {}> {
    state = {id: ""};
    constructor() {
      super();
      this.open = this.open.bind(this);
    }
    public open() {
      var id = (ReactDOM.findDOMNode(this.refs.id) as HTMLInputElement).value
      this.setState({id: id});
    }
    public render() {
      return(
        <Form>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" ref="id"/>
              <InputGroup.Button>
                <Button onClick={this.open}><span className="glyphicon glyphicon-film" aria-hidden="true"></span></Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          {((id) => {
            if(id != "") {
              return <iframe width="320" height="240" src={"https://www.youtube.com/embed/" + id}></iframe>
            }
            else {
              return "";
            }
          })(this.state.id)}
        </Form>
      );
    }
  }
}
