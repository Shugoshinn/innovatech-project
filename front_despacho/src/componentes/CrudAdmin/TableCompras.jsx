import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { FormDespacho } from "./FormDespacho";
import axios from "axios";
import { FiPlus, FiDollarSign } from "react-icons/fi";

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);

  const compras = async () => {
    await axios.get("http://192.168.30/api/v1/ventas", {
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
  }
    }).then((response) => {
      console.log(response.data);
      setVentas(response.data);
    });
  };
  // Llamada a la función para obtener los datos cuando el componente se monta
  useEffect(() => {
    compras();
  }, []);

  //state que controla el modal
  const [openModal, setOpenModal] = useState(false);

  //state que abre el modal junto con la data del id seleccionado
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const handleAbrirModal = (venta) => {
    setVentaSeleccionada(venta);
    setOpenModal(true);
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-teal-500 text-white border-b">
                  <th className="px-4 py-3 text-left font-semibold">Orden de compra</th>
                  <th className="px-4 py-3 text-left font-semibold">Dirección</th>
                  <th className="px-4 py-3 text-left font-semibold">Fecha de compra</th>
                  <th className="px-4 py-3 text-right font-semibold">Valor total</th>
                  <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas
                  .filter((venta) => !venta.despachoGenerado)
                  .map((venta) => (
                    <tr key={venta.idVenta} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {venta.idVenta}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {venta.direccionCompra}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {venta.fechaCompra}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-right font-semibold">
                        <div className="inline-flex items-center gap-1">
                          <FiDollarSign className="w-4 h-4" />
                          {venta.valorCompra}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleAbrirModal(venta)}
                          className="inline-flex items-center gap-2 px-4 py-1 bg-orange-200 rounded-lg shadow-md hover:bg-orange-300 transition-all duration-300"
                        >
                          <FiPlus className="w-4 h-4" />
                          <span className="text-sm font-medium">Generar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Modal
        onClose={() => {
          setOpenModal(false);
        }}
        open={openModal}
      >
        {ventaSeleccionada && (
          <FormDespacho
            venta={ventaSeleccionada}
            onClose={() => {
              //onclose es un prop que pasa funciones al modal con el form abierto, por ende al cerrarse, se ejecutan esas 2 funciones
              setOpenModal(false), compras();
            }}
          />
        )}
      </Modal>
    </>
  );
};
