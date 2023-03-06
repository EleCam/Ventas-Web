import React, { Component } from "react";
import {
  Table,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import ModalEvidencia from "./modalEvidencia";
import ModalRecarga from "./modalRecTarjeta";
import ModalTarjeta from "./modalTarjeta";

class ModalDetalle extends Component {
  constructor() {
    super();
    this.state = {
      datosTarjeta: [],
      tarjeta: "",
      modal: false,
      modal2: false,
      modal3: false,
      viewBtn: true,
      infoEvicencia: [],
      desredimirModal: false,
    };
  }

  reenviarCorreo = (idOrden) => {
    document.getElementById("spiner").hidden = false;
    let data = {
      orden: idOrden,
    };
    const requestInfo = {
      method: "POST",
      body: JSON.stringify(data),
      header: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    };
    fetch(
      "https://recorcholis-services.azurewebsites.net/webR_ReEnviaCorreo.php",
      requestInfo
    )
      .then((response) => response.json())
      .then((respuesta) => {
        document.getElementById("spiner").hidden = true;
        if (respuesta["error"] === "no") {
          Swal.fire("Correo Enviado Correctamente", "", "success");
        } else {
          Swal.fire("Error", respuesta["error"], "warning");
        }
      })
      .catch((e) => console.log(e));
  };
  desredimir = (orden) => {
    console.log(orden);
    this.setState({ orderNow: orden });
    let data = {
      cupon: orden.codigoCupon,
    };
    const requestInfo = {
      method: "POST",
      body: JSON.stringify(data),
      header: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    };
    fetch(
      "https://diniz.com.mx/diniz/servicios/services/getOrdenVirgen.php",
      requestInfo
    )
      .then((response) => response.json())
      .then(({ OK }) => {
        if (OK) {
          Swal.fire("Se realizo el ajuste de activacion", "", "success");
        } else {
          Swal.fire("Error", "No aplica para reactivacion", "warning");
        }
      });
  };
  modalTarjeta = (tarjeta, tipo, orden) => {
    this.setState({ orderNow: orden });
    document.getElementById("cargaModalTarjeta").hidden = false;
    //if (tipo === "recargaTarjeta" ) document.getElementById('recargaModal').hidden = false;

    let data = {
      CGUID: tarjeta,
    };
    const requestInfo = {
      method: "POST",
      body: JSON.stringify(data),
      header: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    };
    fetch(
      "https://recorcholis-services.azurewebsites.net/getCard.php",
      requestInfo
    )
      .then((response) => response.json())
      .then((datosTarjeta) => {
        console.log(datosTarjeta);
        // if (datosTarjeta.Code === 1 && datosTarjeta.Message.includes("nueva")) {
        //   this.setState({ tarjeta });
        //   this.switchModalDesredimir();
        // } else
        if (datosTarjeta !== null) {
          if (tipo === "infoTarjeta") {
            console.log(datosTarjeta);
            if (datosTarjeta.Code === 0) {
              this.setState({ datosTarjeta: datosTarjeta["Data"] });
            } else this.setState({ datosTarjeta: datosTarjeta });
            this.setState({ tarjeta });
            this.switchModal();
          } else {
            if (datosTarjeta.Code === 1)
              this.setState({ datosTarjeta: datosTarjeta["Data"] });
            else this.setState({ datosTarjeta: datosTarjeta });
            this.setState({ tarjeta });
            this.switchModal2();
          }

          document.getElementById("cargaModalTarjeta").hidden = true;
        } else {
          let data = {
            token: "bfc7edc9-ed5d-4dbd-b1eb-ab6ce11194ff",
            orden: this.state.ordenNow,
            status: "approved",
            monto: 340,
          };
          let requestInfo = {
            method: "POST",
            body: JSON.stringify(data),
            header: new Headers({
              "Content-Type": "application/json",
              Accept: "application/json",
            }),
          };
          fetch(
            "https://recorcholis-services.azurewebsites.net/getOrderDetail.ph",
            requestInfo
          );
          this.setState({ datosTarjeta: [] });
          Swal.fire(
            "Error",
            "No se ha encontrado el detalle de la tarjeta",
            "warning"
          );
        }
      })
      .catch((e) => {
        console.log(e);
        document.getElementById("cargaModalTarjeta").hidden = true;
      });
  };
  verbtn = (tarjeta, id) => {
    let data = new FormData();
    data.append("viewbtn", 1);
    data.append("tarjeta", tarjeta);
    data.append("orden", id);

    const requestInfo = {
      method: "POST",
      body: JSON.stringify(data),
      header: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    };
    fetch(
      "https://diniz.com.mx/diniz/servicios/services/subirEvidenciaRec.php",
      {
        method: "POST",
        body: data,
        header: new Headers({
          "Content-Type": "application/json",
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.res === 1) {
          this.setState({ viewBtn: false });
          this.setState({ infoEvicencia: response });
        }
      });
  };
  switchModal = () => {
    this.setState({ modal: !this.state.modal });
  };
  switchModal2 = () => {
    this.setState({ modal2: !this.state.modal2 });
    this.vBtn();
  };
  switchModal3 = () => {
    this.setState({ modal3: !this.state.modal3 });
    this.vBtn();
  };
  switchModalDesredimir = () => {
    this.setState({ desredimirModal: !this.state.desredimirModal });
  };
  vBtn = () => {
    this.props.ordenDetalle.map((orden, index) => {
      if (orden.recorcard !== "") {
        this.verbtn(orden.recorcard, orden.ordenid);
      }
    });
  };
  viewEvidencia = (orden) => {
    this.setState({ orderNow: orden });
    this.setState({ modal3: !this.state.modal3 });
  };
  componentDidMount() {
    this.vBtn();
  }
  render() {
    return (
      <div>
        {this.state.modal === true ? (
          <ModalTarjeta
            modal={this.state.modal}
            switchModal={this.switchModal}
            datosTarjeta={this.state.datosTarjeta}
            tarjeta={this.state.tarjeta}
          />
        ) : this.state.modal2 === true ? (
          <ModalRecarga
            modal={this.state.modal2}
            switchModal={this.switchModal2}
            datosTarjeta={this.state.datosTarjeta}
            tarjeta={this.state.tarjeta}
            orden={this.state.orderNow}
          />
        ) : this.state.modal3 === true ? (
          <ModalEvidencia
            modal={this.state.modal3}
            switchModal={this.switchModal3}
            datosTarjeta={this.state.datosTarjeta}
            tarjeta={this.state.tarjeta}
            order={this.state.orderNow}
            info={this.state.infoEvicencia}
          />
        ) : (
          ""
        )}
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
            <p id="titulo_mod">
              Detalle Orden #{this.props.ordenDetalle[0].ordenid}{" "}
              <Spinner id="cargaModalTarjeta" hidden={true}></Spinner>{" "}
            </p>
          </ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <th>Codigo</th>
                <th>Recorcard</th>
                <th>Monto</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Regalo</th>
                <th>Cupon</th>
                <th>Descripcion</th>
                <th></th>
              </thead>
              {this.props.ordenDetalle.map((orden, index) => (
                <tr key={index}>
                  <td>{orden.codigo}</td>
                  <td
                    style={{
                      textDecorationLine: "underline",
                      color: "purple",
                      cursor: "pointer",
                    }}
                    onClick={
                      orden.recorcard !== ""
                        ? this.modalTarjeta.bind(
                            this,
                            orden.recorcard,
                            "infoTarjeta",
                            orden
                          )
                        : ""
                    }
                  >
                    {orden.recorcard}
                  </td>
                  <td>{orden.monto}</td>
                  <td>{orden.tipo}</td>
                  <td>{orden.fecha}</td>
                  <td>
                    {orden.regalo_email} / {orden.regalo_name}
                  </td>
                  <td>{orden.codigoCupon} </td>
                  <td>{orden.descripcion} </td>
                  {orden.codigoCupon === "Recarga" && this.state.viewBtn ? (
                    <td>
                      <Button
                        onClick={this.modalTarjeta.bind(
                          this,
                          orden.recorcard,
                          "recargaTarjeta",
                          orden
                        )}
                        color="info"
                        size="md"
                      >
                        Recargar
                      </Button>
                    </td>
                  ) : orden.codigoCupon === "Recarga" ? (
                    <Button
                      onClick={this.viewEvidencia.bind(this, orden)}
                      color="info"
                      size="md"
                    >
                      Evidencia
                    </Button>
                  ) : (
                    orden.tipo === "nueva" && (
                      <Button
                        color="primary"
                        onClick={this.desredimir.bind(this, orden)}
                        style={{ width: 110, fontSize: 13, marginTop: 10 }}
                      >
                        Reactivar Cupon
                      </Button>
                    )
                  )}
                </tr>
              ))}
            </Table>
          </ModalBody>
          <ModalFooter>
            <Col sm={2}>
              <Button
                onClick={this.reenviarCorreo.bind(
                  this,
                  this.props.ordenDetalle[0].ordenid
                )}
                color="info"
                size="md"
              >
                Enviar Correo
                <Spinner
                  hidden="true"
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  id="spiner"
                  aria-hidden="true"
                />
              </Button>
            </Col>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalDetalle;
