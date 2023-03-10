import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Input,
  Table,
  Label,
  FormGroup,
  Form,
} from "reactstrap";
import ModalDetalle from "./modalDetalle";
import Swal from "sweetalert2";
var moment = require("moment");

window.usuario = { nombre: "Eleazar Campos Miranda", noempl: "37604" };
class Main extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      ordenesLS: [],
      ordenDetalle: [],
    };
  }

  usuario_con = (numero) => {
    let data = {
      sesionid: numero,
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
      "https://diniz.com.mx/diniz/servicios/services/pn_sesion_con2.php",
      requestInfo
    )
      .then((response) => response.json())
      .then((DatosUsuario) => {
        if (DatosUsuario[0].usuarios.noempl !== "x") {
          this.setState({ nombre: DatosUsuario[0].usuarios.nombre });
          window.usuario = {
            nombre: DatosUsuario[0].usuarios.nombre,
            noempl: DatosUsuario[0].usuarios.noempl,
          };
          this.setState({ noempl: DatosUsuario[0].usuarios.noempl });
          this.setState({ puesto: DatosUsuario[0].usuarios.puesto });
          this.setState({ DatosUsuario: DatosUsuario[0].usuarios });
          this.setState({ sesionid: DatosUsuario[0].usuarios.uniqueid });
        } else {
          this.setState({ DatosUsuario: [] });
          window.location.replace("https://diniz.com.mx");
        }
      })
      .catch((e) => console.log(e));
  };

  getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return false;
  };

  goSalir = () => {
    let myurl = "https://diniz.com.mx/index.html?id=" + this.state.sesionid;
    window.location.replace(myurl);
  };

  buscarOrden = () => {
    let data = {
      texto: document.getElementById("txtBuscarOrden")?.value,
      column: document.getElementById("origenData")?.value,
      limit: document.getElementById("limit")?.value,
      origen: document.getElementById("empresa")?.value,
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
      "https://diniz.com.mx/diniz/servicios/services/getOrdenes.php",
      requestInfo
    )
      .then((response) => response.json())
      .then((ordenesLS) => {
        if (ordenesLS !== null) {
          this.setState({ ordenesLS });
        } else {
          this.setState({ ordenesLS: [] });
          Swal.fire("Error", "No se ha encontrado la orden", "warning");
        }
      })
      .catch((e) => console.log(e));
  };

  modalDetalle = (idOrden) => {
    let data = {
      idOrden,
      origen: document.getElementById("empresa")?.value,
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
      "https://diniz.com.mx/diniz/servicios/services/getordenDetalle.php",
      requestInfo
    )
      .then((response) => response.json())
      .then((ordenDetalle) => {
        if (ordenDetalle !== null) {
          this.setState({ ordenDetalle });
          this.switchModal();
        } else {
          // let data = {
          //   token: "bfc7edc9-ed5d-4dbd-b1eb-ab6ce11194ff",
          //   orden: idOrden,
          //   status: "approved",
          //   monto: 340,
          // };
          // fetch(
          //   "https://recorcholis-services.azurewebsites.net/getOrdenDetail.php",
          //   {
          //     method: "POST",
          //     body: JSON.stringify(data),
          //     header: new Headers({
          //       "Content-Type": "application/json",
          //       Accept: "application/json",
          //     }),
          //   }
          // );
          this.setState({ ordenDetalle: [] });
          Swal.fire(
            "Error",
            "No se ha encontrado el detalle de la orden",
            "warning"
          );
        }
      })
      .catch((e) => console.log(e));
  };

  switchModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  componentDidMount = () => {
    if(this.getQueryVariable('id') !== false){
        let quer = this.getQueryVariable('id');
        this.usuario_con(quer);
    }else{
        window.location.replace('https://diniz.com.mx');
    }
  };

  render() {
    return (
      <div>
        <div></div>
        <div style={{ backgroundColor: "mediumturquoise" }}>
          <Row style={{ paddingTop: 10 }}>
            <Col sm={2}></Col>
            <Col sm={8} style={{ textAlign: "center", color: "white" }}>
              <h2>Ordenes Pagina Web Recorcholis</h2>
            </Col>
            <Col sm={2} style={{ textAlign: "left" }}>
              <Button
                outline
                color="danger"
                size="sm"
                id="toggler4"
                onClick={this.goSalir.bind()}
                style={{ marginBottom: "1rem" }}
              >
                Salir
              </Button>
            </Col>
          </Row>
        </div>
        {this.state.modal === true ? (
          <ModalDetalle
            modal={this.state.modal}
            switchModal={this.switchModal}
            ordenDetalle={this.state.ordenDetalle}
          />
        ) : (
          ""
        )}
        <Row
          style={{
            paddingLeft: 70,
            paddingRight: 50,
            paddingTop: 50,
            paddingBottom: 50,
          }}
        >
          <Col sm={12} className="d-flex justify-content-center">
            <div style={{ width: 200, marginRight: 15 }}>
              <p style={{ textAlign: "center", fontWeight: "bold" }}>EMPRESA</p>
              <Input type="select" name="select" id="empresa">
                {/* <option value="all">Todos</option> */}
                <option value="R">Recorcholis</option>
                <option value="K">Kataplum</option>
                <option value="U">UPA</option>
              </Input>
            </div>
            <div style={{ width: 200, marginRight: 15 }}>
              <p style={{ textAlign: "center", fontWeight: "bold" }}>
                PARAMETRO
              </p>

              <Input type="select" name="select" id="origenData">
                {/* <option value="all">Todos</option> */}
                <option value="orden">Orden</option>
                <option value="nombre">Nombre</option>
                <option value="correo">Correo</option>
                <option value="celular">Celular</option>
                <option value="token">Token</option>
              </Input>
            </div>
            <div style={{ width: 150, marginRight: 15 }}>
              <p style={{ textAlign: "center", fontWeight: "bold" }}>LIMITE</p>
              <Input type="select" name="select" id="limit">
                {/* <option value="all">Todos</option> */}
                <option value="10">10</option>
                <option value="100">100</option>
                <option value="1000">1000</option>
              </Input>
            </div>
            <div style={{ width: 350, marginRight: 15 }}>
              <p style={{ textAlign: "center", fontWeight: "bold" }}>
                BUSQUEDA
              </p>
              <Input type="text" id="txtBuscarOrden" />
            </div>
            <div style={{ width: 150, marginRight: 15 }}>
              <p style={{ textAlign: "center", fontWeight: "bold", color:"white" }}>
                a
              </p>
              <Button
                onClick={this.buscarOrden.bind()}
                color="btn btn-primary btn-sm"
                style={{padding:8, fontSize: 12 }}
              >
                Buscar
                <span className="fas fa-search" />
              </Button>
            </div>
          </Col>
          <Col sm={2}></Col>
        </Row>
        <Row style={{ paddingLeft: 50, paddingRight: 50 }}>
          <Col sm={12}>
            <div style={{ paddingLeft: 20, paddingRight: 20 }}>
              <Table
                id="tbTabla"
                borderless
                className="table-bordered table-hover text-left small"
              >
                <thead className="thead-light">
                  <tr>
                    <th>No. Orden</th>
                    <th>Nombre Cliente</th>
                    <th>Correo</th>
                    <th>Telefono</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Estatus</th>
                  </tr>
                </thead>
                <tbody className="bg-light">
                  {this.state.ordenesLS.length > 0
                    ? this.state.ordenesLS.map((orden, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              textDecorationLine: "underline",
                              color: "purple",
                              cursor: "pointer",
                            }}
                            onClick={this.modalDetalle.bind(
                              this,
                              orden.idOrden
                            )}
                          >
                            {orden.idOrden}
                          </td>
                          <td>{orden.nombre}</td>
                          <td>{orden.email}</td>
                          <td>{orden.celular}</td>
                          <td>{orden.fecha}</td>
                          <td>{orden.total}</td>
                          <td>{orden.estatus}</td>
                        </tr>
                      ))
                    : []}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Main;
