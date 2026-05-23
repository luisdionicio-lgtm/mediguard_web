import springApi from '../../api/springApi';

export const emergencyService = {
  getAll: async () => {
    const response = await springApi.get('emergencies/');
    return response.data.map(item => {
      let desc;
      const cat = (item.category || '').toLowerCase();
      if (cat.includes('polic') || cat.includes('police')) {
        desc = 'Central de emergencias policiales para reportar delitos, accidentes y situaciones de riesgo.';
      } else if (cat.includes('ambul') || cat.includes('samu') || cat.includes('med')) {
        desc = 'Servicio de atencion movil de urgencias para emergencias medicas.';
      } else if (cat.includes('bomb') || cat.includes('fire')) {
        desc = 'Atencion de incendios, rescates, accidentes y otras emergencias.';
      } else {
        desc = 'Central de auxilio inmediato y atención de emergencias las 24 horas del día.';
      }

      return {
        id: item.id,
        name: item.name,
        phone: item.phone,
        serviceType: item.category || 'Servicio de Emergencia',
        description: desc,
      };
    });
  },
};
