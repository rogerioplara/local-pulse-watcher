import { useState, useEffect } from 'react';
import { apiService, Application } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getApplications();
      setApplications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar aplicações';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchApplications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
};