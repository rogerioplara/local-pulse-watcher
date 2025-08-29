// Configuração da API para comunicação com o backend
export interface Camera {
  id: string;
  name: string;
  status: "online" | "offline" | "warning";
}

export interface Application {
  id: string;
  name: string;
  lastRecognition: Date;
  coreStatus: "online" | "offline" | "warning";
  serverStatus: "online" | "offline" | "warning";
  cameras: Camera[];
}

// Interfaces para os dados que vêm do backend
interface BackendCameraStatus {
  imageSourceId: number;
  imageSourceLabel: string;
  status: string; // "Online" | "Standby" | "Inactive" | "Offline"
  lastRecognitionEventDateTime: string;
  url: string;
  inactiveMinutes: number;
}

interface BackendApplicationData {
  coreStatus: string;
  serverStatus: string;
  lastRecognition: string;
  cameraStatus: BackendCameraStatus[];
}

interface BackendApplicationResponse {
  url: string;
  data?: BackendApplicationData;
  error?: string;
}

// Configure a URL do backend no arquivo .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Mapear status string para padrão das câmeras
  private mapCameraStatus(status: string): "online" | "offline" | "warning" {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "online": return "online";
      case "standby": return "warning";
      case "inactive": return "warning";
      case "offline": return "offline";
      default: return "offline";
    }
  }

  // Mapear status string para padrão
  private mapApplicationStatus(status: string): "online" | "offline" | "warning" {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === "online") return "online";
    if (normalizedStatus === "warning") return "warning";
    return "offline";
  }

  // Buscar todas as aplicações
  async getApplications(): Promise<Application[]> {
    try {
      const response = await fetch(`${this.baseURL}/applications`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BackendApplicationResponse[] = await response.json();
      
      // Transformar os dados para o formato esperado pela aplicação
      return data.map((item) => {
        if (item.error) {
          // Aplicação offline
          return {
            id: item.url,
            name: item.url,
            lastRecognition: new Date(0), // Data antiga para indicar sem resposta
            coreStatus: "offline" as const,
            serverStatus: "offline" as const,
            cameras: []
          };
        }

        const appData = item.data!;
        return {
          id: item.url,
          name: item.url,
          lastRecognition: new Date(appData.lastRecognition),
          coreStatus: this.mapApplicationStatus(appData.coreStatus),
          serverStatus: this.mapApplicationStatus(appData.serverStatus),
          cameras: appData.cameraStatus.map((camera) => ({
            id: camera.imageSourceId.toString(),
            name: camera.imageSourceLabel,
            status: this.mapCameraStatus(camera.status)
          }))
        };
      });
    } catch (error) {
      console.error("Erro ao buscar aplicações:", error);
      throw error;
    }
  }

  // Endpoint para receber dados de uma aplicação específica
  async updateApplication(applicationData: Partial<Application>): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/applications/${applicationData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar aplicação:", error);
      throw error;
    }
  }

  // Endpoint genérico para receber dados das aplicações locais
  async receiveApplicationData(data: any): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/observability/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro ao receber dados de observabilidade:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();