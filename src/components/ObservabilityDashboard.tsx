import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Server, Cpu, Clock, Activity, Circle } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";

// Mock data - será substituído por dados reais do endpoint
type StatusType = "online" | "offline" | "warning";

interface Camera {
  id: string;
  name: string;
  status: StatusType;
}

interface Application {
  id: string;
  name: string;
  lastRecognition: Date;
  coreStatus: StatusType;
  serverStatus: StatusType;
  cameras: Camera[];
}

const mockApplications: Application[] = [
  {
    id: "app-1",
    name: "Sistema Principal",
    lastRecognition: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    coreStatus: "online" as StatusType,
    serverStatus: "online" as StatusType, 
    cameras: [
      { id: "cam-1", name: "Câmera Entrada", status: "online" as StatusType },
      { id: "cam-2", name: "Câmera Saída", status: "online" as StatusType },
      { id: "cam-3", name: "Câmera Estacionamento", status: "warning" as StatusType },
    ]
  },
  {
    id: "app-2", 
    name: "Sistema Backup",
    lastRecognition: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    coreStatus: "warning" as StatusType,
    serverStatus: "online" as StatusType,
    cameras: [
      { id: "cam-4", name: "Câmera Principal", status: "online" as StatusType },
      { id: "cam-5", name: "Câmera Auxiliar", status: "offline" as StatusType },
    ]
  },
  {
    id: "app-3",
    name: "Sistema Filial A", 
    lastRecognition: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    coreStatus: "offline" as StatusType,
    serverStatus: "offline" as StatusType,
    cameras: [
      { id: "cam-6", name: "Câmera Hall", status: "offline" as StatusType },
      { id: "cam-7", name: "Câmera Recepção", status: "offline" as StatusType },
      { id: "cam-8", name: "Câmera Corredor", status: "offline" as StatusType },
      { id: "cam-9", name: "Câmera Externa", status: "offline" as StatusType },
    ]
  }
];

export const ObservabilityDashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Observabilidade de Aplicações
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitoramento em tempo real das aplicações locais
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Última atualização: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-card shadow-card border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-online/20">
                <Activity className="h-5 w-5 text-status-online" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aplicações Online</p>
                <p className="text-2xl font-bold text-status-online">
                  {mockApplications.filter(app => app.coreStatus === "online").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/20">
                <Clock className="h-5 w-5 text-status-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Com Alertas</p>
                <p className="text-2xl font-bold text-status-warning">
                  {mockApplications.filter(app => app.coreStatus === "warning").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-offline/20">
                <Server className="h-5 w-5 text-status-offline" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-status-offline">
                  {mockApplications.filter(app => app.coreStatus === "offline").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Câmeras</p>
                <p className="text-2xl font-bold text-primary">
                  {mockApplications.reduce((acc, app) => acc + app.cameras.length, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {mockApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      </div>
    </div>
  );
};