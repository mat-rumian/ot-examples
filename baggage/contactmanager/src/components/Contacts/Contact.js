import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Consumer } from '../../context';
import axios from 'axios';
import { Link } from 'react-router-dom';
class Contact extends Component {

    constructor() {
        super();
        this.state = {
            showContactInfo: false
        };
        //this.onshowClick() = this.onshowClick.bind(this);
    }


    //if you do not use arrow function, this keyword won't work for just onshowClick(){}
    onShowClick = (e) => {
        this.setState({ showContactInfo: !this.state.showContactInfo });
        console.log(e);
    };

    //For an arrow function, we pust async before the parameters
    onDeleteClick = (id, dispatch, e) => {

        //Since we are not gettin anything, we need not save the rquest response in a variable
        try {
            
            // Get current context
            const currentContext = window.sumoLogicOpenTelemetryRum.api.context.active()

            // Get current span
            const currentSpan = window.sumoLogicOpenTelemetryRum.api.trace.getSpan(currentContext);
            // Add custom attribute to the span
            currentSpan.setAttribute('contact_id', id);
            console.log(`current context: ${currentContext}`);

            // Set vars
            let currentBaggage = null;
            let newBaggage = null;
            let newContext = null;
            // Get current baggage
            try {
                currentBaggage = window.sumoLogicOpenTelemetryRum.api.propagation.getBaggage(currentContext) ?? window.sumoLogicOpenTelemetryRum.api.propagation.createBaggage();
            }
            catch (e) {
                console.log(`current baggage error: ${e}`)
            }
            console.log(`current baggage: ${currentBaggage}`)

            // Set new baggage
            try {
                newBaggage = currentBaggage.setEntry("username", { value: `${id}` });
            } catch (e) { console.log(`new baggage error: ${e}`) }
            console.log(`new baggage: ${newBaggage}`)
            console.log(newBaggage.getAllEntries())

            // Set new context with baggage
            try {
                newContext = window.sumoLogicOpenTelemetryRum.api.propagation.setBaggage(currentContext, newBaggage);
                //console.log(window.sumoLogicOpenTelemetryRum.api.propagation.getBaggage(newContext));

            } catch (e) {
                console.log(e);
            }
            // console.log(`newContext: ${newContext}`)
            console.log(newContext)
            
            // Make a call with context containing baggage
            window.sumoLogicOpenTelemetryRum.api.context.with(newContext, async () => {
                await axios.delete(`http://localhost:8081/user?id=${id}`);
            });

            dispatch({ type: 'DELETE_CONTACT', payload: id });

        }
        catch (e) {
            dispatch({ type: 'DELETE_CONTACT', payload: id });

        }

    };

    render() {

        const { id, name, email, phone } = this.props.contact;
        const { showContactInfo } = this.state;
        //or even using this.props.branding also works, but destructuring makes the code cleaner.
        return (
            <Consumer>
                {value => {
                    const { dispatch } = value;
                    return (
                        <div className="card card-body mb-3">
                            <h4>{name}{' '}
                                <i
                                    onClick={this.onShowClick}
                                    className="fa fa-sort-desc"
                                    style={{ cursor: 'pointer' }}
                                ></i>
                                <i className="fa fa-times" style={{ cursor: 'pointer', float: 'right', color: 'red' }}
                                    onClick={this.onDeleteClick.bind(this, id, dispatch)} ></i>

                                <Link to={`contact/edit/${id}`} >

                                    <i
                                        className='fa fa-pencil'
                                        style={{
                                            cursor: 'pointer', float: 'right', color: 'black', marginRight: '1rem'
                                        }}></i>

                                </Link>
                            </h4>

                            {showContactInfo ? (
                                <ul className="list-group">
                                    <li className='list-group-item'>Email : {email}</li>
                                    <li className='list-group-item'>Phone : {phone}</li>
                                </ul>
                            ) : null}

                        </div>
                    )
                }}
            </Consumer>


        )

    }


}

//note default props is defined outside the class.
Contact.defaultProps = {
    name: 'Priya',
    phone: '9450465058'
}

Contact.propTypes = {

    contact: PropTypes.object.isRequired,
}
export default Contact;
