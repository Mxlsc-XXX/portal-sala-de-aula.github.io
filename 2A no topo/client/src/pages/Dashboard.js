import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [trabalhos, setTrabalhos] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trabalhosRes, avisosRes, datasRes] = await Promise.all([
          axios.get('http://localhost:5000/api/trabalhos'),
          axios.get('http://localhost:5000/api/avisos'),
          axios.get('http://localhost:5000/api/datas')
        ]);

        setTrabalhos(trabalhosRes.data);
        setAvisos(avisosRes.data);
        setDatas(datasRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Próximos Trabalhos */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Próximos Trabalhos</h2>
        <div className="space-y-4">
          {trabalhos.slice(0, 3).map((trabalho) => (
            <div key={trabalho._id} className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium">{trabalho.titulo}</h3>
              <p className="text-sm text-gray-600">{trabalho.materia}</p>
              <p className="text-sm text-gray-500">
                Entrega: {new Date(trabalho.dataEntrega).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Últimos Avisos */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Últimos Avisos</h2>
        <div className="space-y-4">
          {avisos.slice(0, 3).map((aviso) => (
            <div key={aviso._id} className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium">{aviso.titulo}</h3>
              <p className="text-sm text-gray-600">{aviso.conteudo}</p>
              <p className="text-sm text-gray-500">
                {new Date(aviso.data).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Próximas Datas */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Próximas Datas</h2>
        <div className="space-y-4">
          {datas.slice(0, 3).map((data) => (
            <div key={data._id} className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium">{data.titulo}</h3>
              <p className="text-sm text-gray-600">{data.descricao}</p>
              <p className="text-sm text-gray-500">
                {new Date(data.data).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 