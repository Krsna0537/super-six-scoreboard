
import { Player } from '../types/team';

// Safe getter for player initials with fallbacks
export const getPlayerInitials = (player: Player): string => {
  if (!player || !player.profiles) return "??";
  const firstName = player.profiles.first_name || "";
  const lastName = player.profiles.last_name || "";
  return (firstName[0] || "") + (lastName[0] || "");
};

// Safe getter for player full name with fallbacks
export const getPlayerFullName = (player: Player): string => {
  if (!player || !player.profiles) return "Unknown Player";
  return `${player.profiles.first_name || ""} ${player.profiles.last_name || ""}`.trim() || "Unknown Player";
};
