import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";
import { FiCheck, FiClock, FiEdit2, FiAlertCircle, FiLoader } from "react-icons/fi";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const despacho = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://192.168.3.20/api/v1/despachos", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      console.log(response.data);
      setDespachos(response.data || []);
    } catch (err) {
      console.error('Error cargando despachos:', err);
      setError(err.message || 'Error al cargar los despachos');
      setDespachos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    despacho();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
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
                  <p className="text-gray-600 font-medium">Cargando despachos...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <FiAlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <p className="text-red-600 font-medium">Error al cargar despachos</p>
                  <p className="text-gray-500 text-sm mt-1">{error}</p>
                  <button
                    onClick={() => despacho()}
                    className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            ) : despachos.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-gray-600 font-medium">No hay despachos registrados</p>
                  <p className="text-gray-400 text-sm mt-1">Los despachos aparecerán aquí cuando se generen</p>
                </div>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-teal-500 text-white border-b">
                    <th className="px-4 py-3 text-left font-semibold">Orden de despacho</th>
                    <th className="px-4 py-3 text-left font-semibold">Orden de compra</th>
                    <th className="px-4 py-3 text-left font-semibold">Dirección de entrega</th>
                    <th className="px-4 py-3 text-left font-semibold">Fecha despacho</th>
                    <th className="px-4 py-3 text-left font-semibold">Patente Camión</th>
                    <th className="px-4 py-3 text-center font-semibold">Entregado</th>
                    <th className="px-4 py-3 text-center font-semibold">Intentos</th>
                    <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {despachos.map((despacho) => (
                  <tr key={despacho.idDespacho} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-900">{despacho.idDespacho}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {despacho.idCompra}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {despacho.direccionCompra}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {despacho.fechaDespacho}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {despacho.patenteCamion}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        {despacho.entregado ? (
                          <FiCheck className="w-5 h-5 text-green-500" title="Entregado" />
                        ) : (
                          <FiClock className="w-5 h-5 text-yellow-500" title="Pendiente" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                      {despacho.intento}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleAbrirModal(despacho)}
                        className="inline-flex items-center gap-2 px-4 py-1 bg-orange-200 rounded-lg shadow-md hover:bg-orange-300 transition-all duration-300"
                        title="Cerrar despacho">
                        <FiEdit2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Cerrar</span>
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
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => {
              //onclose es un prop que pasa funciones al modal con el form abierto, por ende al cerrarse, se ejecutan esas 2 funciones
              setOpenModal(false), despacho();
            }}
          />
        )}
      </Modal>
    </>
  );
};
