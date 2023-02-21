import React, { Component } from 'react';
import {Table, Modal, ModalHeader, ModalBody} from 'reactstrap';

class ModalRecarga extends Component{

    render(){
        return(
            <div>
                <Modal id="ModalProveedor1" isOpen={this.props.modal} toggle={this.props.switchModal} size="xl" >
                    <ModalHeader toggle={this.props.switchModal} className="bg-info text-white"><p id='titulo_mod'>Detalle Tarjeta #{this.props.tarjeta}</p></ModalHeader>
                    <ModalBody>
                    {this.props.datosTarjeta.Code !== "1" ? 
                    
                    <Table>
                        <thead>
                            <th>Emoney</th>
                            <th>Bonus</th>
                            <th>Etickets</th>
                        </thead>
                    <tr>
                        <td>{this.props.datosTarjeta.emoney}</td>
                        <td>{this.props.datosTarjeta.bonus}</td>
                        <td>{this.props.datosTarjeta.etickets}</td>
                    </tr>
                    </Table>
                    :
                    <>
                        <p>  Existe un error con la tarjeta. </p>
                        <p> {this.props.datosTarjeta.Message}.</p>
                    </>}
                    </ModalBody>
                </Modal>:''
            </div>
        );
    }    
}

export default ModalRecarga