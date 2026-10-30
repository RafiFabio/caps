import api from "./api/";

export const getDashboardMetrics = async () => {
  const response = await api.get("/dashboard/metrics");
  return response.data;
};

export const getNetworkPerformance = async (period = "1h") => {
  const response = await api.get("/dashboard/network-performance", {
    params: { period },
  });

  return response.data;
};

export const getAnomalies = async () => {
  const response = await api.get("/dashboard/anomalies");
  return response.data;
};

export const getIncidents = async () => {
  const response = await api.get("/dashboard/incidents");
  return response.data;
};
