import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { FormDespacho } from "./FormDespacho";
import axios from "axios";
import { FiPlus, FiDollarSign, FiAlertCircle, FiLoader } from "react-icons/fi";

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const compras = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://192.168.3.20/api/v1/ventas", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      console.log(response.data);
      setVentas(response.data || []);
    } catch (err) {
      console.error('Error cargando ventas:', err);
      setError(err.message || 'Error al cargar las órdenes de compra');
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <FiLoader className="w-10 h-10 text-teal-500 animate-spin mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Cargando órdenes de compra...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <FiAlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <p className="text-red-600 font-medium">Error al cargar órdenes de compra</p>
                  <p className="text-gray-500 text-sm mt-1">{error}</p>
                  <button
                    onClick={() => compras()}
                    className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            ) : ventas.filter((venta) => !venta.despachoGenerado).length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-gray-600 font-medium">No hay órdenes de compra pendientes</p>
                  <p className="text-gray-400 text-sm mt-1">Todas las órdenes ya tienen despacho asignado</p>
                </div>
              </div>
            ) : (
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
            )}
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
