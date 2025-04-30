import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader, Plus, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const playerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  player_type: z.enum(['batter', 'bowler', 'all_rounder']),
  batting_style: z.string().optional(),
  bowling_style: z.string().optional(),
  jersey_number: z.string().optional(),
  image_url: z.string().url('Please enter a valid image URL').optional(),
});

type PlayerFormData = z.infer<typeof playerSchema>;

interface CreatePlayerDialogProps {
  onPlayerCreated: () => void;
}

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

const CreatePlayerDialog: React.FC<CreatePlayerDialogProps> = ({ onPlayerCreated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      player_type: 'batter',
    },
  });

  const playerType = watch('player_type');

  const onSubmit = async (data: PlayerFormData) => {
    try {
      setLoading(true);
      // Insert directly into players table
      const { error: playerError } = await supabase
        .from('players')
        .insert({
          first_name: data.first_name,
          last_name: data.last_name,
          image_url: imageUrl,
          batting_style: data.batting_style || null,
          bowling_style: data.bowling_style || null,
          jersey_number: data.jersey_number ? parseInt(data.jersey_number) : null,
          player_type: data.player_type,
        });
      if (playerError) throw playerError;
      reset();
      setImageUrl(null);
      setOpen(false);
      onPlayerCreated();
    } catch (error: any) {
      console.error('Error creating player: ', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Player
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={imageUrl || undefined} />
              <AvatarFallback>PL</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2 w-full">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/avatar.png"
                value={imageUrl || ''}
                onChange={e => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                {...register('first_name')}
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                {...register('last_name')}
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="player_type">Player Type</Label>
            <Select
              value={playerType}
              onValueChange={(value) => setValue('player_type', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select player type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="batter">Batter</SelectItem>
                <SelectItem value="bowler">Bowler</SelectItem>
                <SelectItem value="all_rounder">All Rounder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(playerType === 'batter' || playerType === 'all_rounder') && (
            <div className="space-y-2">
              <Label htmlFor="batting_style">Batting Style</Label>
              <Select
                value={watch('batting_style')}
                onValueChange={(value) => setValue('batting_style', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batting style" />
                </SelectTrigger>
                <SelectContent>
                  {battingStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(playerType === 'bowler' || playerType === 'all_rounder') && (
            <div className="space-y-2">
              <Label htmlFor="bowling_style">Bowling Style</Label>
              <Select
                value={watch('bowling_style')}
                onValueChange={(value) => setValue('bowling_style', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bowling style" />
                </SelectTrigger>
                <SelectContent>
                  {bowlingStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="jersey_number">Jersey Number</Label>
            <Input
              id="jersey_number"
              type="number"
              {...register('jersey_number')}
              placeholder="Enter jersey number"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setImageUrl(null);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Player'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlayerDialog;
