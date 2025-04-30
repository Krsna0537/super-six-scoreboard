import React, { useState, useEffect } from 'react';
import TournamentsList from '@/components/tournaments/TournamentsList';
import TournamentFilters from '@/components/tournaments/TournamentFilters';
import { TournamentCardProps } from '@/components/tournaments/TournamentCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateTournamentDialog from '@/components/tournaments/CreateTournamentDialog';
import useUserRole from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isAdmin } = useUserRole();

  const fetchTournaments = async (filters: any = {}) => {
    setIsLoading(true);
    let query = supabase.from('tournaments').select('*');
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.searchTerm) {
      query = query.ilike('name', `%${filters.searchTerm}%`);
    }
    const { data, error } = await query.order('start_date', { ascending: true });
    if (!error && data) {
      setTournaments(
        data.map((t: any) => ({
          id: t.id,
          name: t.name,
          startDate: t.start_date,
          endDate: t.end_date,
          location: t.location,
          teams: t.teams_count || 0,
          status: t.status,
          image: t.image || 'https://placehold.co/400x225/0EA5E9/FFFFFF?text=Tournament',
        }))
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleFilter = (filters: any) => {
    fetchTournaments(filters);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="cricket-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="cricket-heading-1">Tournaments</h1>
          {isAdmin && (
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="cricket-button-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Create Tournament
            </Button>
          )}
        </div>
        <TournamentFilters onFilter={handleFilter} />
        <TournamentsList tournaments={tournaments} isLoading={isLoading} />
        {isAdmin && (
          <CreateTournamentDialog 
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onTournamentCreated={() => fetchTournaments()}
          />
        )}
      </div>
    </div>
  );
};

export default Tournaments;
