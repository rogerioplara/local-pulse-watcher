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

// Configure a URL do backend no arquivo .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Buscar todas as aplicações
  async getApplications(): Promise<Application[]> {
    try {
      const response = await fetch(`${this.baseURL}/applications`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transformar os dados se necessário para adequar ao formato esperado
      return data.map((app: any) => ({
        ...app,
        lastRecognition: new Date(app.lastRecognition)
      }));
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