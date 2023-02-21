
import React, { Component } from 'react';
import {Table, Modal, ModalHeader, ModalBody, Input,Row,Col, ModalFooter, Spinner, Button} from 'reactstrap';
import Swal from 'sweetalert2';
class ModalRecarga extends Component{

    handleUploadfile = (event) => {
        event.preventDefault();
        let data = new FormData();
        data.append('contratoconvenio', document.getElementById('file').files[0] );
        data.append('convenioid', 1 );
        data.append('origen', "evidencia-" +  this.props.orden.ordenid + " " + document.getElementById('Tarjta').value) ;
        data.append('monto', document.getElementById('Monto').value);
        data.append('registro', window.usuario['noempl']);
        data.append('tarjeta', document.getElementById('Tarjta').value);
        data.append('orden', this.props.orden.ordenid);
        fetch(  'https://diniz.com.mx/diniz/servicios/services/subirEvidenciaRec.php', {
             method: 'POST',
             body: data,
             header: new Headers({
                'Content-Type': 'application/json',
            })
        })
        .then((response) => response.json())
        .then((response) =>  {

            if( response.exito === true ){

                  console.log(response)
                  data = { 
                    CGUID : response.tarjeta, 
                    AEMoney : response.monto
                  }
                  this.creditPurshace(data);
            }else{
                if( response.ext != "pdf" &&  
                response.ext != "png" && 
                response.ext != "jpg" && 
                response.ext != "jpeg"  ) Swal.fire('Tipo debe ser PDF,PNG,JPG', '', 'warning');
                else Swal.fire('Error al procesar', '', 'warning');
            }
           
        });

        this.setState({ selectedFile: null });
    }
    creditPurshace = (data) => {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(data),
            header: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        };
        fetch('https://recorcholis-services.azurewebsites.net/creditPurshace.php', requestInfo)
            .then(response => response.json())
            .then(response => {
              this.props.switchModal()
              
              Swal.fire({
                icon: 'success',
                title: 'Recarga Realizada',
                text: 'Bonus: '+response.Data.bonus +'\n Dinero: ' + response.Data.emoney+'\n Promocion bonus: ' + response.Data.promotionbonus+'\n Tickets: ' + response.Data.etickets+'\n Nombre: ' + response.Data.firstname +'\n Correo: ' + response.Data.email ,
                showConfirmButton: false,
                timer: 30000
              });
            })
            .catch(e => Swal.fire('Error al procesar', '', 'warning'));
        }
    render(){
        return (
          <div>
            <Modal
              id="ModalProveedor1"
              isOpen={this.props.modal}
              toggle={this.props.switchModal}
              size="xl"
            >
              <ModalHeader
                toggle={this.props.switchModal}
                className="bg-info text-white"
              >
                <p id="titulo_mod">Realizar Recarga Manuala Tarjeta #{this.props.tarjeta}</p>
              </ModalHeader>
              <ModalBody>
                {this.props.datosTarjeta.Code === 0? (
                  <>
                    <Row>
                      <Col sm={3}>
                        <b>Numero de tarjeta: </b>
                        {this.props.tarjeta}
                      </Col>
                      <Col sm={3}>
                        <b>Emoney: </b>
                        {this.props.datosTarjeta.Data.emoney}
                      </Col>
                      <Col sm={3}>
                        <b>Bonus: </b>
                        {this.props.datosTarjeta.Data.bonus}
                      </Col>
                      <Col sm={3}>
                        <b>Etickets: </b>
                        {this.props.datosTarjeta.Data.etickets}
                      </Col>
                    </Row>
                    <div
                      style={{ width: "100%" , marginTop: 30}}
                      className= { "d-flex justify-content-center"}
                    >
                        <div style={{width: "50%"}}>
                        <Row>
                        <Col sm = {6}> 
                            <p>Monto a recargar</p>
                        </Col>
                        <Col sm = {6}> 
                    <Input type='select' id='Monto'>
                      <option value={100}>100</option>
                      <option value={150}>150</option>
                      <option value={200}>200</option>
                      <option value={250}>250</option>
                      <option value={300}>300</option>
                      <option value={350}>350</option>
                      <option value={400}>400</option>
                      <option value={450}>450</option>
                      <option value={500}>500</option>
                      <option value={550}>550</option>
                      <option value={600}>600</option>
                      <option value={650}>650</option>
                      <option value={700}>700</option>
                      <option value={750}>750</option>
                      <option value={800}>800</option>
                      <option value={850}>850</option>
                      <option value={900}>900</option>
                      <option value={950}>950</option>
                      <option value={1000}>1000</option>
                    </Input>
                    <Input type="text" id="Tarjta" hidden={true} defaultValue={this.props.tarjeta}  readOnly/>
                        </Col>
                    </Row> 
                        <Row>
                        <Col sm = {6}> 
                            <p>Evidencia: </p>
                        </Col>
                        <Col sm = {6}> 
                        <Input type="file" id="file" />
                        </Col>
                    </Row> 
                        <Row>
                            <Col sm = {6}> 
                        <p>Realiza: </p>
                            </Col>
                            <Col sm = {6}> 
                        {window.usuario['nombre']}
                            </Col>
                        </Row>
                        </div>
                   
                    </div>
                  </>
                ) : (
                  <>
                    <p> Existe un error con la tarjeta. </p>
                    <p> {this.props.datosTarjeta.Message}.</p>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
              <Col sm={2}>
                            <Button  onClick={this.handleUploadfile} color='info' size="md" >Realizar Recarga
                                <Spinner
                                    hidden='true'
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    id='spiner'
                                    aria-hidden="true"/>
                            </Button>
                        </Col>
              </ModalFooter>
            </Modal>
            :''
          </div>
        );
    }    
}

export default ModalRecarga