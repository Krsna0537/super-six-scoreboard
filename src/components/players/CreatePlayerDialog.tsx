
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  jerseyNumber: z.string().min(1).max(3).regex(/^\d+$/, { message: 'Jersey number must be numeric' }).transform(Number).optional(),
  teamId: z.string().optional(),
  battingStyle: z.string().optional(),
  bowlingStyle: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlayerCreated?: () => void;
}

const CreatePlayerDialog: React.FC<CreatePlayerDialogProps> = ({ 
  open, 
  onOpenChange,
  onPlayerCreated
}) => {
  const { toast } = useToast();
  
  const { data: teams, isLoading: isLoadingTeams } = useQuery({
    queryKey: ["teams-for-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teams").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
    enabled: open,
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      battingStyle: '',
      bowlingStyle: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // First create a profile
      const { data: profileData, error: profileError } = await supabase.from('profiles').insert({
        first_name: data.firstName,
        last_name: data.lastName,
        role: 'player',
      }).select('id').single();
      
      if (profileError) throw profileError;
      
      // Then create the player with the profile id
      const { error: playerError } = await supabase.from('players').insert({
        profile_id: profileData.id,
        team_id: data.teamId || null,
        jersey_number: data.jerseyNumber || null,
        batting_style: data.battingStyle || null,
        bowling_style: data.bowlingStyle || null,
      });

      if (playerError) throw playerError;

      toast({
        title: 'Success',
        description: 'Player created successfully',
      });
      
      onOpenChange(false);
      form.reset();
      if (onPlayerCreated) onPlayerCreated();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create player',
        variant: 'destructive',
      });
    }
  };

  const battingStyles = [
    { value: 'Right-handed', label: 'Right-handed' },
    { value: 'Left-handed', label: 'Left-handed' },
  ];

  const bowlingStyles = [
    { value: 'Right-arm fast', label: 'Right-arm fast' },
    { value: 'Left-arm fast', label: 'Left-arm fast' },
    { value: 'Right-arm medium', label: 'Right-arm medium' },
    { value: 'Left-arm medium', label: 'Left-arm medium' },
    { value: 'Right-arm off-spin', label: 'Right-arm off-spin' },
    { value: 'Left-arm orthodox', label: 'Left-arm orthodox' },
    { value: 'Leg-break', label: 'Leg-break' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Player</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams?.map((team) => (
                          <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jerseyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jersey Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="battingStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batting Style (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {battingStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bowlingStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bowling Style (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bowlingStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Player</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlayerDialog;
