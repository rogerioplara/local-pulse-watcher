import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Server, Cpu, Clock, Circle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Camera {
  id: string;
  name: string;
  status: "online" | "offline" | "warning";
}

interface Application {
  id: string;
  name: string;
  lastRecognition: Date;
  coreStatus: "online" | "offline" | "warning";
  serverStatus: "online" | "offline" | "warning";
  cameras: Camera[];
}

interface ApplicationCardProps {
  application: Application;
}

const StatusIcon = ({ status }: { status: "online" | "offline" | "warning" }) => {
  switch (status) {
    case "online":
      return <CheckCircle className="h-4 w-4 text-status-online" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-status-warning" />;
    case "offline":
      return <XCircle className="h-4 w-4 text-status-offline" />;
  }
};

const StatusBadge = ({ status }: { status: "online" | "offline" | "warning" }) => {
  const variants = {
    online: "bg-status-online/20 text-status-online border-status-online/30",
    warning: "bg-status-warning/20 text-status-warning border-status-warning/30", 
    offline: "bg-status-offline/20 text-status-offline border-status-offline/30"
  };

  const labels = {
    online: "Online",
    warning: "Atenção",
    offline: "Offline"
  };

  return (
    <Badge variant="outline" className={cn("border", variants[status])}>
      <StatusIcon status={status} />
      <span className="ml-1">{labels[status]}</span>
    </Badge>
  );
};

const getTimeSince = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Agora";
  if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d atrás`;
};

export const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const overallStatus = application.coreStatus === "offline" || application.serverStatus === "offline" 
    ? "offline" 
    : application.coreStatus === "warning" || application.serverStatus === "warning"
    ? "warning"
    : "online";

  const onlineCameras = application.cameras.filter(cam => cam.status === "online").length;
  const warningCameras = application.cameras.filter(cam => cam.status === "warning").length;
  const offlineCameras = application.cameras.filter(cam => cam.status === "offline").length;

  return (
    <Card className={cn(
      "p-6 bg-gradient-card shadow-card border transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02]",
      overallStatus === "online" && "border-status-online/30",
      overallStatus === "warning" && "border-status-warning/30", 
      overallStatus === "offline" && "border-status-offline/30"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{application.name}</h3>
          <p className="text-sm text-muted-foreground">ID: {application.id}</p>
        </div>
        <StatusBadge status={overallStatus} />
      </div>

      {/* Core and Server Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cpu className="h-4 w-4" />
            <span>Core</span>
          </div>
          <StatusBadge status={application.coreStatus} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Server className="h-4 w-4" />
            <span>Servidor</span>
          </div>
          <StatusBadge status={application.serverStatus} />
        </div>
      </div>

      {/* Cameras Overview */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Camera className="h-4 w-4" />
          <span>Câmeras ({application.cameras.length})</span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {onlineCameras > 0 && (
            <Badge variant="outline" className="bg-status-online/20 text-status-online border-status-online/30">
              {onlineCameras} Online
            </Badge>
          )}
          {warningCameras > 0 && (
            <Badge variant="outline" className="bg-status-warning/20 text-status-warning border-status-warning/30">
              {warningCameras} Atenção
            </Badge>
          )}
          {offlineCameras > 0 && (
            <Badge variant="outline" className="bg-status-offline/20 text-status-offline border-status-offline/30">
              {offlineCameras} Offline
            </Badge>
          )}
        </div>

        {/* Individual camera status */}
        <div className="grid grid-cols-2 gap-1 text-xs">
          {application.cameras.map((camera) => (
            <div key={camera.id} className="flex items-center gap-1 text-muted-foreground">
              <Circle className={cn(
                "h-2 w-2 fill-current",
                camera.status === "online" && "text-status-online",
                camera.status === "warning" && "text-status-warning",
                camera.status === "offline" && "text-status-offline"
              )} />
              <span className="truncate">{camera.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Recognition */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Último reconhecimento:</span>
          <span className={cn(
            "font-medium",
            getTimeSince(application.lastRecognition).includes("m") ? "text-status-online" : 
            getTimeSince(application.lastRecognition).includes("h") ? "text-status-warning" : 
            "text-status-offline"
          )}>
            {getTimeSince(application.lastRecognition)}
          </span>
        </div>
      </div>
    </Card>
  );
};