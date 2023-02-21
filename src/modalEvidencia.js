import React, { Component } from "react";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";

class ModalEvidencia extends Component {
  render() {
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
            <p id="titulo_mod">Detalle Tarjeta #{this.props.tarjeta}</p>
          </ModalHeader>
          <ModalBody>
            {this.props.datosTarjeta.Code !== "1" ? (
              <Table>
                <thead>
                  <th>Orden</th>
                  <th>Tarjeta</th>
                  <th>Monto</th>
                  <th>Recagó</th>
                  <th>Evidencia</th>
                  <th>Fecha</th>
                </thead>
                <tr>
                  <td>{this.props.info.response.orden}</td>
                  <td>{this.props.info.response.tarjeta}</td>
                  <td>{this.props.info.response.monto}</td>
                  <td>{this.props.info.response.nomregistro}</td>
                  <td>
                    <a
                      href={
                        "https://diniz.com.mx/diniz/servicios/services/files/evidencia-" +
                        this.props.info.response.orden +
                        " " +
                        this.props.info.response.tarjeta
                        +
                        "--" +this.props.info.response.evidencia
                      }
                      target="_blank"
                    >
                      {this.props.info.response.evidencia}
                    </a>
                  </td>
                  <td>{this.props.info.response.fecha}</td>
                </tr>
              </Table>
            ) : (
              <>
                <p> Existe un error con la tarjeta. </p>
                <p> {this.props.datosTarjeta.Message}.</p>
              </>
            )}
          </ModalBody>
        </Modal>
        :''
      </div>
    );
  }
}

export default ModalEvidencia;
