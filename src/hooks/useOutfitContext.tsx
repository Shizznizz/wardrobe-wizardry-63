
  const updateOutfit = async (id: string, updates: Partial<Outfit>): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to update outfits');
      return false;
    }
    
    try {
      // Convert date objects to ISO strings for the database
      const dbUpdates = {
        ...updates,
        date_added: updates.dateAdded ? (updates.dateAdded instanceof Date ? updates.dateAdded.toISOString() : updates.dateAdded) : undefined,
        last_worn: updates.lastWorn ? (updates.lastWorn instanceof Date ? updates.lastWorn.toISOString() : updates.lastWorn) : undefined,
        // Remove properties that aren't in the database schema
        dateAdded: undefined,
        lastWorn: undefined
      };
      
      const { error } = await supabase
        .from('outfits')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setOutfits(prev => prev.map(outfit => 
        outfit.id === id ? { ...outfit, ...updates } : outfit
      ));
      
      toast.success('Outfit updated');
      return true;
    } catch (e) {
      console.error('Error updating outfit:', e);
      toast.error('Failed to update outfit');
      return false;
    }
  };
