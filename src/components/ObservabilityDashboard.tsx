import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Server, Cpu, Clock, Activity, Circle, RefreshCw } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import { useApplications } from "@/hooks/useApplications";
import { Button } from "@/components/ui/button";

export const ObservabilityDashboard = () => {
  const { applications, loading, error, lastUpdate, refetch } = useApplications();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando aplicações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Erro ao carregar dados: {error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

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
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Última atualização: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Carregando...'}</span>
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
                  {applications.filter(app => app.coreStatus === "online").length}
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
                  {applications.filter(app => app.coreStatus === "warning").length}
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
                  {applications.filter(app => app.coreStatus === "offline").length}
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
                  {applications.reduce((acc, app) => acc + app.cameras.length, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <Server className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhuma aplicação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};